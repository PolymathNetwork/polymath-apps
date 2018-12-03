// @flow

import React, { Component } from 'react';
import moment from 'moment-timezone';
import { DatePicker, DatePickerInput } from 'carbon-components-react';
import styled from 'styled-components';

import type { InputProps } from '../types';

import './style.scss';

type PickerValue = [Date, string];

const Container = styled.div`
  // TODO @grsmto: remove this hack once we got rid of Carbon
  .bx--form-item {
    margin-bottom: 0px !important;
  }

  .bx--date-picker .bx--date-picker__icon {
    top: 0.7rem;
  }
`;

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
    })
      .startOf('day')
      .toDate();

    setFieldValue(name, date);
  };
  render() {
    const { field, label, ...otherProps } = this.props;

    const { onChange, value, ...fieldProps } = field;
    const displayValue = value ? moment(value).format('MM / DD / YYYY') : '';
    const minValue = moment().format('MM / DD / YYYY');

    return (
      <Container>
        <DatePicker
          datePickerType="single"
          dateFormat="m / d / Y"
          minDate={minValue}
          id={field.name}
          onChange={this.handleOnChange}
        >
          <DatePickerInput
            datePickerType="single"
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
      </Container>
    );
  }
}
