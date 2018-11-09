// @flow

import React, { PureComponent } from 'react';
import numeral from 'numeral';

import BaseInput from '../BaseInput';

import type { InputProps } from '../types';

type Props = InputProps & { value: string };

export default class NumberInput extends PureComponent<Props> {
  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const {
      field: { name },
      form: { setFieldValue },
    } = this.props;
    const {
      target: { value },
    } = event;

    const normalizedValue = numeral(value).value();

    setFieldValue(name, normalizedValue);
  };

  render() {
    const {
      field,
      field: { value, ...fieldProps },
      className,
      ...otherProps
    } = this.props;

    let formattedValue = value;

    if (value !== '' && value !== null) {
      formattedValue = numeral(value).format('0,0');
    }

    return (
      <BaseInput
        type="text"
        id={field.name}
        {...otherProps}
        {...fieldProps}
        value={formattedValue}
        onChange={this.handleChange}
      />
    );
  }
}
