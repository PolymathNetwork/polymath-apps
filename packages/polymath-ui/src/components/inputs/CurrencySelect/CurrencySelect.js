import React, { Component } from 'react';

import Input from './Input';
import { InputProps } from '../types';

export default class CurrencySelect extends Component<InputProps> {
  handleChange = value => {
    const {
      field,
      form: { setFieldValue, setFieldTouched },
    } = this.props;
    setFieldValue(field.name, value);
    setFieldTouched(field.name, true);
  };

  handleBlur = () => {
    const {
      name,
      form: { setFieldTouched },
    } = this.props;
    setFieldTouched(name, true);
  };

  render() {
    const { field, ...otherProps } = this.props;
    return (
      <Input
        {...field}
        {...otherProps}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      />
    );
  }
}
