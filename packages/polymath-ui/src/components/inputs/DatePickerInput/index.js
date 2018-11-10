// @flow

import React, { Component } from 'react';
import moment from 'moment-timezone';
import { DatePicker, DatePickerInput } from 'carbon-components-react';

import type { InputProps } from '../types';

type PickerValue = [Date, string];

export default class DatePickerInputField extends Component<InputProps> {
  handleOnChange = (pickerValue: PickerValue, stringValue: string) => {
    const {
      form: { setFieldValue },
      field: { name },
    } = this.props;

    const [month, day, year] = stringValue.split(' / ');
    const date = moment({
      year,
      month: parseInt(month, 10) - 1,
      day,
    }).toDate();
    setFieldValue(name, date);
  };
  render() {
    const { field, label, className, ...otherProps } = this.props;

    const { onChange, value, ...fieldProps } = field;
    const displayValue = value ? moment(value).format('MM / DD / YYYY') : '';
    const minValue = moment().format('MM / DD / YYYY');

    return (
      <DatePicker
        className={className}
        datePickerType="single"
        dateFormat="m / d / Y"
        minDate={minValue}
        id={field.name}
        onChange={this.handleOnChange}
      >
        <DatePickerInput
          autoComplete="off"
          id={`${field.name}-input`}
          labelText={label}
          placeholder="mm / dd / yyyy"
          value={displayValue}
          onChange={() => {}}
          pattern={null}
          {...fieldProps}
          {...otherProps}
        />
      </DatePicker>
    );
  }
}
