import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import { constants } from '@polymathnetwork/new-shared';

import { formikProxy } from '../formikProxy';
import { BaseInput } from '../BaseInput';

type Value = number | BigNumber | null;

interface Props {
  max: number | BigNumber;
  min: number | BigNumber;
  maxDecimals: number;
  useBigNumbers: boolean;
  value: Value;
  name: string;
  onChange: (value: Value) => void;
  onBlur: () => void;
}

interface State {
  oldValue: null;
  displayValue: string;
}

const { MIN_SAFE_NUMBER, MAX_SAFE_NUMBER } = constants;

// Any state which is valid for displaying in the input. If the new value of
// the input doesn't match this, it will rollback to a previous state
const displayValueRegex = /(^[\d,]*\.?$)|(^\.$)|(^\.[0,]|[1-9,][\d,]*$)|(^[\d,]*\.[\d,]*$)/;
// States that cannot be formatted
const endsWithZeroInDecimalsRegex = /^[\d,]*\.[,\d]*[0,]$/;
const pendingDotRegex = /^[\d,]*\.$/;
// States that can be auto-corrected
const startsWithDotRegex = /^\.\d+$/;

// TODO @RafaelVidaurre: Change max/min behavior to prevent a change instead of
// changing the value to the max/min allowed

// FIXME @monitz87: right now if the user inputs ".0" it gets changed back to "0".
// It should support consecutive zeroes after the decimal point until the user inputs another
// number
export class NumberInputPrimitive extends Component<Props, State> {
  public static defaultProps = {
    onChange: () => {},
    onBlur: () => {},
    min: -Infinity,
    max: Infinity,
    maxDecimals: 18, // max amount of decimals supported by solidity
    useBigNumbers: false,
    value: null,
    name: 'unnamed',
  };

  public static getDisplayValue(value: Value, props: Props) {
    if (value === null) {
      return '';
    }
    const parsedValue = NumberInputPrimitive.toBigNumber(value, props);
    return parsedValue.toFormat();
  }

  public static isBigNumber(value: any) {
    return value.isBigNumber || value._isBigNumber;
  }

  public static getDerivedStateFromProps(props: Props, state: State) {
    const { oldValue } = state;
    const { value, useBigNumbers, min, max, name } = props;
    const propsValueChanged = oldValue !== value;

    if (!useBigNumbers && (min === -Infinity || max === Infinity)) {
      // tslint:disable-next-line:no-console
      console.warn(
        `NumberInput(${name})'s min and max should be set when useBigNumbers is disabled. \
        They have been defaulted to the biggest supported values for safety`
      );
    }

    if (
      useBigNumbers &&
      value !== null &&
      !NumberInputPrimitive.isBigNumber(value)
    ) {
      // tslint:disable-next-line:no-console
      console.warn(
        `NumberInput(${name})'s value must be a BigNumber object when useBigNumbers is set to true`
      );
    }

    if (propsValueChanged) {
      return {
        displayValue: NumberInputPrimitive.getDisplayValue(value, props),
        oldValue: value,
      };
    }

    return null;
  }

  /**
   * Transforms a value into a BigNumber instance while enforcing
   * numeric restrictions
   */
  public static toBigNumber(
    v: number | string | BigNumber,
    { min, max, useBigNumbers, maxDecimals }: Props
  ) {
    let value: number | string | BigNumber = v;
    if (typeof value === 'string') {
      value = value.replace(/,/g, '');
    } else if (typeof value === 'number') {
      value = String(value);
    }

    const bnValue = new BigNumber(value).decimalPlaces(
      maxDecimals,
      BigNumber.ROUND_FLOOR
    );

    let minimum = min;
    let maximum = max;

    if (!useBigNumbers) {
      if (min !== null) {
        minimum = min < MIN_SAFE_NUMBER ? MIN_SAFE_NUMBER : min;
      }
      if (max !== null) {
        maximum = max > MAX_SAFE_NUMBER ? MAX_SAFE_NUMBER : max;
      }
    }

    value = BigNumber.max(minimum, bnValue);
    value = BigNumber.min(maximum, bnValue);

    return value;
  }

  /**
   * Determines wether or not displayValue is in an "intermediate state" which
   * means that it cannot be cleaned up as it needs more input from the user.
   * to determine what the next value will be. For example "0." or "12.00"
   *
   * @param displayValue The value in the input that the user sees
   */
  public static isInIntermediateState(displayValue: string) {
    const endsWithZeroInDecimals = endsWithZeroInDecimalsRegex.test(
      displayValue
    );
    const hasPendingDot = pendingDotRegex.test(displayValue);

    return endsWithZeroInDecimals || hasPendingDot;
  }

  /**
   * Wether or not the display value is valid. If this returns false the
   * display value will revert to its previous state
   *
   * @returns boolean
   */
  public static isValidDisplayValue(value: string, maxDecimals: number) {
    if (value === '') {
      return true;
    }

    if (maxDecimals === 0 && pendingDotRegex.test(value)) {
      return false;
    }

    return displayValueRegex.test(value);
  }

  public state = { displayValue: '', oldValue: null };

  /**
   * Cleans up and formats the display value shown in the UI
   *
   * @param nextDisplayValue the value to sanitize
   */
  public sanitizeDisplayValue = (nextDisplayValue: string): string => {
    const displayValue = this.state.displayValue;
    const isValid = NumberInputPrimitive.isValidDisplayValue(
      nextDisplayValue,
      this.props.maxDecimals
    );

    if (!isValid) {
      return displayValue;
    }

    if (nextDisplayValue === '') {
      return '';
    }

    const startsWithDot = startsWithDotRegex.test(nextDisplayValue);
    const inIntermediateState = NumberInputPrimitive.isInIntermediateState(
      nextDisplayValue
    );
    const canBeCorrected = startsWithDot || !inIntermediateState;

    if (canBeCorrected) {
      return NumberInputPrimitive.toBigNumber(
        nextDisplayValue,
        this.props
      ).toFormat();
    }

    return nextDisplayValue;
  };

  public handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { onChange, useBigNumbers } = this.props;
    const { target } = event;

    if (target instanceof HTMLInputElement) {
      const { value } = target;
      const displayValue = this.sanitizeDisplayValue(value);

      this.setState({ displayValue });

      if (
        onChange &&
        !NumberInputPrimitive.isInIntermediateState(displayValue)
      ) {
        if (displayValue.replace(/\s/g, '') === '') {
          onChange(null);
          return;
        }

        const parsedValue = NumberInputPrimitive.toBigNumber(
          displayValue,
          this.props
        );

        if (useBigNumbers) {
          onChange(parsedValue);
          return;
        }

        onChange(parsedValue.toNumber());
      }
    }
  };

  public render() {
    const { name, value, onBlur, min, max, ...inputProps } = this.props;
    const { displayValue } = this.state;

    return (
      <BaseInput
        type="text"
        id={name}
        name={name}
        {...inputProps}
        value={displayValue}
        onBlur={onBlur}
        onChange={this.handleChange}
      />
    );
  }
}

const EnhancedNumberInput = formikProxy(NumberInputPrimitive);

export const NumberInput = Object.assign(EnhancedNumberInput, {
  defaultProps: NumberInputPrimitive.defaultProps,
});
