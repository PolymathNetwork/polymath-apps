import React, { Component } from 'react';

import Input from './Input';
import { InputProps } from '../types';

export default class CurrencySelect extends Component<InputProps> {
  handleChange = value => {
    const {
      field,
      form: { setFieldValue },
    } = this.props;
    setFieldValue(field.name, value);
  };
  render() {
    const { field, ...otherProps } = this.props;
    return <Input {...field} {...otherProps} onChange={this.handleChange} />;
  }
}
