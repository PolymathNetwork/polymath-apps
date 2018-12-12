import React, { Component } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { constants } from '@polymathnetwork/new-shared';

import { formikProxy } from '../formikProxy';
import { BaseInput } from '../BaseInput';
import { InputProps } from '../types';

export interface Props extends InputProps {
  name: string;
  max: number | BigNumber;
  min: number | BigNumber;
  value?: number | BigNumber;
  maxDecimals: number;
  useBigNumbers: boolean;
}

type State = {
  oldValue: null;
  displayValue: string;
};

const { MIN_SAFE_NUMBER, MAX_SAFE_NUMBER } = constants;

// Any state which is valid for displaying in the input. If the new value of
// the input doesn't match this, it will rollback to a previous state
const displayValueRegex = /(^[\d,]*\.?$)|(^\.$)|(^\.[0,]|[1-9,][\d,]*$)|(^[\d,]*\.[\d,]*$)/;
// States that cannot be formatted
const endsWithZeroInDecimalsRegex = /^[\d,]*\.[,\d]*[0,]$/;
const pendingDotRegex = /^[\d,]*\.$/;
// States that can be auto-corrected
const startsWithDotRegex = /^\.\d+$/;

const StyledBaseInput = styled(BaseInput)`
  /* Remove ugly handles on Chrome/Mozilla for number inputs (until mouse hover) */
  /* Only on desktop */

  @media screen and (min-width: 768px) {
    -moz-appearance: textfield;

    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }
`;

// TODO @RafaelVidaurre: Change max/min behavior to prevent a change instead of
// changing the value to the max/min allowed

// FIXME @monitz87: right now if the user inputs ".0" it gets changed back to "0".
// It should support consecutive zeroes after the decimal point until the user inputs another
// number
export class NumberInputPrimitive extends Component<Props, State> {
  state = { displayValue: '', oldValue: null };
  static defaultProps = {
    onChange: () => {},
    onBlur: () => {},
    min: -Infinity,
    max: Infinity,
    maxDecimals: 18, // max amount of decimals supported by solidity
    useBigNumbers: false,
    value: null,
    name: 'unnamed',
  };

  static getDisplayValue(value?: number | BigNumber, props: Props) {
    if (value === null) {
      return '';
    }
    const parsedValue = NumberInputComponent.toBigNumber(value, props);
    return parsedValue.toFormat();
  }

  static isBigNumber(value) {
    return value.isBigNumber || value._isBigNumber;
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const { oldValue } = state;
    const { value, useBigNumbers, min, max, name } = props;
    const propsValueChanged = oldValue !== value;

    if (!useBigNumbers && (min === -Infinity || max === Infinity)) {
      console.warn(
        `NumberInput(${name})'s min and max should be set when useBigNumbers is disabled. They have been defaulted to the biggest supported values for safety`
      );
    }

    if (
      useBigNumbers &&
      value !== null &&
      !NumberInputComponent.isBigNumber(value)
    ) {
      console.warn(
        `NumberInput(${name})'s value must be a BigNumber object when useBigNumbers is set to true`
      );
    }

    if (propsValueChanged) {
      return {
        displayValue: NumberInputComponent.getDisplayValue(value, props),
        oldValue: value,
      };
    }

    return null;
  }

  /**
   * Transforms a value into a BigNumber instance while enforcing
   * numeric restrictions
   */
  static toBigNumber(
    v: number | string | BigNumber,
    { min, max, useBigNumbers, maxDecimals }: Props
  ) {
    let value = v;
    if (typeof value === 'string') {
      value = value.replace(/,/g, '');
    } else if (typeof value === 'number') {
      value = String(value);
    }

    value = new BigNumber(value).decimalPlaces(
      maxDecimals,
      BigNumber.ROUND_FLOOR
    );

    let minimum = min;
    let maximum = max;

    if (!useBigNumbers) {
      minimum = min < MIN_SAFE_NUMBER ? MIN_SAFE_NUMBER : min;
      maximum = max > MAX_SAFE_NUMBER ? MAX_SAFE_NUMBER : max;
    }

    value = BigNumber.max(minimum, value);
    value = BigNumber.min(maximum, value);

    return value;
  }

  /**
   * Determines wether or not displayValue is in an "intermediate state" which
   * means that it cannot be cleaned up as it needs more input from the user.
   * to determine what the next value will be. For example "0." or "12.00"
   *
   * @param displayValue The value in the input that the user sees
   */
  static isInIntermediateState(displayValue: string) {
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
  static isValidDisplayValue(value: string, maxDecimals: number) {
    if (value === '') {
      return true;
    }

    if (maxDecimals === 0 && pendingDotRegex.test(value)) {
      return false;
    }

    return displayValueRegex.test(value);
  }

  /**
   * Cleans up and formats the display value shown in the UI
   *
   * @param nextDisplayValue the value to sanitize
   */
  sanitizeDisplayValue = (nextDisplayValue?: string): string => {
    const displayValue = this.state.displayValue;
    const isValid = NumberInputComponent.isValidDisplayValue(
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
    const inIntermediateState = NumberInputComponent.isInIntermediateState(
      nextDisplayValue
    );
    const canBeCorrected = startsWithDot || !inIntermediateState;

    if (canBeCorrected) {
      return NumberInputComponent.toBigNumber(
        nextDisplayValue,
        this.props
      ).toFormat();
    }

    return nextDisplayValue;
  };

  handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { onChange, useBigNumbers } = this.props;
    const { value } = event.target;

    const displayValue = this.sanitizeDisplayValue(value);

    this.setState({ displayValue });

    if (onChange && !NumberInputComponent.isInIntermediateState(displayValue)) {
      if (displayValue.replace(/\s/g, '') === '') {
        onChange(null);
        return;
      }

      const parsedValue = NumberInputComponent.toBigNumber(
        displayValue,
        this.props
      );

      if (useBigNumbers) {
        onChange(parsedValue);
        return;
      }

      onChange(parsedValue.toNumber());
    }
  };

  render() {
    const { name, value, onBlur, min, max, ...inputProps } = this.props;
    const { displayValue } = this.state;

    return (
      <StyledBaseInput
        type="text"
        id={name}
        {...inputProps}
        value={displayValue}
        onBlur={onBlur}
        onChange={this.handleChange}
      />
    );
  }
}

export const NumberInput = formikProxy(NumberInputPrimitive);
