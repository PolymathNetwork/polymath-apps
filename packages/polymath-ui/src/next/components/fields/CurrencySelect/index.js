import React, { Component } from 'react';
import CurrencySelect from '../../../../components/CurrencySelect';
import { InputProps } from '../types';

export default class CurrencySelectField extends Component<InputProps> {
  handleChange = value => {
    const {
      field,
      form: { setFieldValue },
    } = this.props;
    setFieldValue(field.name, value);
  };
  render() {
    const { field, ...otherProps } = this.props;
    return (
      <CurrencySelect {...field} {...otherProps} onChange={this.handleChange} />
    );
  }
}
