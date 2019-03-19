import React, { Component, FC } from 'react';
import { isNumber } from 'lodash';
import numeral from 'numeral';

import { FormikProxy, EnhancedComponentProps } from '../FormikProxy';
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

  public handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'e' || event.key === '-') {
      event.preventDefault();
    }
  };

  public handlePaste = (event: React.ClipboardEvent) => {
    const str = event.clipboardData.getData('Text');
    const newStr = str.replace(/[^0-9+.]/g, '');
    if (str !== newStr || !isNumber(str)) {
      event.preventDefault();
    }
  };

  public handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const { target } = event;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    if (parseFloat(target.value) > 100) {
      return;
    }

    const normalizedValue = target.value
      ? numeral(parseFloat(target.value))
          .divide(100)
          .value()
      : parseFloat(target.value);
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
        onKeyPress={this.handleKeyPress}
        onPaste={this.handlePaste}
        value={formattedValue}
        {...otherProps}
        onChange={this.handleChange}
      />
    );
  }
}

const EnhancedPercentageInput: FC<EnhancedComponentProps<number>> = ({
  field,
  form,
  ...rest
}) => (
  <FormikProxy<number>
    field={field}
    form={form}
    render={formikProps => (
      <PercentageInputPrimitive {...rest} {...formikProps} />
    )}
  />
);

export const PercentageInput = EnhancedPercentageInput;
