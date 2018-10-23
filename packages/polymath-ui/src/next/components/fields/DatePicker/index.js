// @flow

import React, { Component } from 'react';
import { DatePicker, DatePickerInput } from 'carbon-components-react';

import type { InputProps } from '../types';

type PickerValue = [Date, string];

export default class DatePickerInputField extends Component<InputProps> {
  handleOnChange = (pickerValue: PickerValue, stringValue: string) => {
    const {
      form: { setFieldValue },
      field: { name },
    } = this.props;

    setFieldValue(name, stringValue);
  };
  render() {
    const {
      field,
      form: { errors, touched, name: formName },
      label,
      className,
      ...otherProps
    } = this.props;

    const { onChange, value, ...fieldProps } = field;
    const error = touched[field.name] && errors[field.name];
    const invalid = error && touched;

    return (
      <DatePicker
        className={className}
        datePickerType="single"
        dateFormat="m / d / Y"
        id={`${formName}-${field.name}`}
        onChange={this.handleOnChange}
      >
        <DatePickerInput
          id={`${formName}-${field.name}-input`}
          labelText={label}
          placeholder="mm / dd / yyyy"
          invalid={invalid}
          invalidText={error}
          pattern={null}
          value={value || ''}
          onChange={() => {}}
          {...fieldProps}
          {...otherProps}
        />
      </DatePicker>
    );
  }
}
