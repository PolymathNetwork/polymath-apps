// @flow

// TODO @RafaelVidaurre: Support negative values

import React, { Component } from 'react';
import styled from 'styled-components';
import numeral from 'numeral';
import BaseInput from '../BaseInput';

import type { InputProps } from '../types';

type Props = InputProps & { value: number };
type State = {| displayValue: string, oldValue?: string |};

// Any state which is valid for desplaying in the input. If the new value of
// the input doesn't match this, it will rollback to a previous state
const displayValueRegex = /(^[\d,]*\.?$)|(^\.$)|(^\.[0,]|[1-9,][\d,]*$)|(^[\d,]*\.[\d,]*$)/;

// States that cannot be formatted
const endsWithZeroInDecimalsRegex = /^[\d,]*\.[,\d]*[0,]$/;
const pendingDot = /^[\d,]*\.$/;

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

export default class NumberInput extends Component<Props, State> {
  state = {
    displayValue: '',
    oldValue: '',
  };

  static getDisplayValue(value: number) {
    return numeral(value).format('0,0[.][000000000]');
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const { value } = props.field;
    const { oldValue, displayValue } = state;

    let newDisplayValue = displayValue;

    if (value !== oldValue) {
      newDisplayValue = NumberInput.getDisplayValue(value);
    }

    return {
      oldValue: value,
      displayValue: newDisplayValue,
    };
  }

  static isValidDisplayValue(value: string) {
    if (value === '') {
      return true;
    }

    return displayValueRegex.test(value);
  }

  /**
   * Determines wether or not displayValue is in an "intermediate state" which
   * means that it cannot be cleaned up as it needs more input from the user.
   * to determine what the next value will be. For example "0." or "12.00"
   *
   * @static
   * @param displayValue The value in the input that the user sees
   */
  static isInIntermediateState(displayValue: string) {
    // const startsWithDot = startsWithDotRegex.test(displayValue);
    const endsWithZeroInDecimals = endsWithZeroInDecimalsRegex.test(
      displayValue
    );
    const pendingDor = pendingDot.test(displayValue);

    return endsWithZeroInDecimals || pendingDor;
  }

  /**
   * Returns a valid version of a display value, for example. If the
   * display value is "0.."" return "0."
   */
  sanitizeDisplayValue = (nextDisplayValue: string): string => {
    const displayValue = this.state.displayValue;
    const isValid = NumberInput.isValidDisplayValue(nextDisplayValue);

    if (!isValid) {
      return displayValue;
    }

    if (!NumberInput.isInIntermediateState(nextDisplayValue)) {
      return numeral(nextDisplayValue).format('0,0[.][0000000000]');
    }

    return nextDisplayValue;
  };

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const { name } = this.props.field;
    const { setFieldValue } = this.props.form;

    // Only update the field value if we reach a valid displayValue state
    //
    const displayValue = this.sanitizeDisplayValue(value);
    //

    // Update field value only if displayValue is not in an intermediate state
    if (!NumberInput.isInIntermediateState(displayValue)) {
      const newValue = numeral(displayValue).value();
      //
      setFieldValue(name, newValue);
    } else {
      this.setState({ displayValue });
    }
  };

  render() {
    const {
      field,
      field: { value, ...fieldProps },
      className,
      ...otherProps
    } = this.props;
    const { displayValue } = this.state;
    //

    return (
      <StyledBaseInput
        type="text"
        id={field.name}
        {...otherProps}
        {...fieldProps}
        value={displayValue}
        onChange={this.handleChange}
      />
    );
  }
}
