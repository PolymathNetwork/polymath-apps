import React, { Component } from 'react';
import { isNumber } from 'lodash';
import numeral from 'numeral';

import { formikProxy } from '../formikProxy';
import { BaseInput } from '../BaseInput';

interface Props {
  onChange: (value: number) => void;
  name: string;
  value: number;
}

export class PercentageInputPrimitive extends Component<Props> {
  public static formatValue = (value: any) => {
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

  public handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const { target } = event;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const normalizedValue = parseFloat(target.value) / 100;
    onChange(normalizedValue);
  };

  public render() {
    const { name, value, ...otherProps } = this.props;
    const formattedValue = PercentageInputPrimitive.formatValue(value);

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
