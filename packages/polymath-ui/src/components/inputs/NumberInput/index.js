import React, { Component } from 'react';
import styled from 'styled-components';
import numeral from 'numeral';
import formikProxy from '../formikProxy';
import BaseInput from '../BaseInput';

type Props = {|
  name: string,
  value?: number,
  onChange?: value => void,
  onBlur?: () => void,
|};

type State = {|
  oldValue: null,
  displayValue: string,
|};

// Any state which is valid for desplaying in the input. If the new value of
// the input doesn't match this, it will rollback to a previous state
const displayValueRegex = /(^[\d,]*\.?$)|(^\.$)|(^\.[0,]|[1-9,][\d,]*$)|(^[\d,]*\.[\d,]*$)/;

// States that cannot be formatted
const endsWithZeroInDecimalsRegex = /^[\d,]*\.[,\d]*[0,]$/;
const pendingDot = /^[\d,]*\.$/;

// States that can be auto-corrected
const startsWithDotRegex = /^\.\d+$/;

export class NumberInput extends Component<Props, State> {
  state = { displayValue: '', oldValue: null };
  static defaultProps = {
    onChange: () => {},
    onBlur: () => {},
  };

  static getDisplayValue(value: number) {
    return numeral(value).format('0,0[.][000000000]');
  }

  static getDerivedStateFromProps(props, state) {
    const { oldValue } = state;
    const { value } = props;
    const propsValueChanged = oldValue !== value;

    if (propsValueChanged) {
      return {
        displayValue: NumberInput.getDisplayValue(value),
        oldValue: value,
      };
    }

    return null;
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
   * Wether or not the display value is valid. If this returns false the
   * display value will revert to its previous state
   *
   * @returns boolean
   */
  static isValidDisplayValue(value: string) {
    if (value === '') {
      return true;
    }

    return displayValueRegex.test(value);
  }

  sanitizeDisplayValue = (nextDisplayValue: string): string => {
    const displayValue = this.state.displayValue;
    const isValid = NumberInput.isValidDisplayValue(nextDisplayValue);

    if (!isValid) {
      return displayValue;
    }

    const canBeCorrected = startsWithDotRegex.test(nextDisplayValue);

    if (canBeCorrected) {
      return numeral(nextDisplayValue).format('0,0[.][0000000000]');
    }

    // TODO @RafaelVidaurre: Remove this redundancy
    if (!NumberInput.isInIntermediateState(nextDisplayValue)) {
      return numeral(nextDisplayValue).format('0,0[.][0000000000]');
    }

    return nextDisplayValue;
  };

  handleChange = event => {
    const { onChange } = this.props;
    const { value } = event.target;

    const displayValue = this.sanitizeDisplayValue(value);

    if (!NumberInput.isInIntermediateState(displayValue)) {
      const newValue = numeral(displayValue).value();
      this.setState({ displayValue });
      onChange(newValue);
    } else {
      this.setState({ displayValue });
    }
  };

  render() {
    const { name, value, onBlur, ...otherProps } = this.props;
    const { displayValue } = this.state;

    return (
      <BaseInput
        type="text"
        id={name}
        {...otherProps}
        value={displayValue}
        onBlur={onBlur}
        onChange={this.handleChange}
      />
    );
  }
}

export default formikProxy(NumberInput);
