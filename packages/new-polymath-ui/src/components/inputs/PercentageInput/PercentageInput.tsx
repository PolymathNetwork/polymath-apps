import React, { PureComponent } from 'react';
import { isNumber } from 'lodash';
import numeral from 'numeral';

import { formikProxy } from '../formikProxy';
import { BaseInput, BaseInputProps } from '../BaseInput';

export interface Props extends BaseInputProps {
  onChange?: (value: any) => void;
}

export default class PercentageInputPrimitive extends PureComponent<Props> {
  handleChange = event => {
    const { onChange } = this.props;
    const normalizedValue = parseFloat(event.target.value) / 100;

    onChange(normalizedValue);
  };

  static formatValue = (value: any) => {
    if (!isNumber(value) || isNaN(value)) {
      return '';
    }

    return Math.max(
      Math.min(
        numeral(value) // This avoid strange JS decimal converting: 0.1111*100 = 11.110000000000001
          .multiply(100)
          .value(),
        100
      ),
      0
    );
  };

  render() {
    const { name, value, ...otherProps } = this.props;
    const formattedValue = PercentageInput.formatValue(value);

    return (
      <BaseInput
        type="number"
        unit="%"
        min={0}
        max={100}
        id={name}
        name={name}
        value={formattedValue}
        {...otherProps}
        onChange={this.handleChange}
      />
    );
  }
}

export const PercentageInput = formikProxy(PercentageInputPrimitive);
