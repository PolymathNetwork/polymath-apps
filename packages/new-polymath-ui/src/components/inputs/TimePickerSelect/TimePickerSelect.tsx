import { range } from 'lodash';
import React, { Component } from 'react';
import moment from 'moment';

import { SelectPrimitive, SelectProps } from '../Select';
import { formikProxy } from '../formikProxy';
import { InputProps } from '../types';

export interface TimePickerSelectProps extends SelectProps {
  format: string;
}

const minutesInADay = 60 * 24;
const timeIntervals = range(0, minutesInADay, 30);

export class TimePickerSelectPrimitive extends Component<
  TimePickerSelectProps
> {
  static defaultProps = {
    format: 'h:mm A',
  };

  handleChange = ({ value }: { label: string; value: number }) => {
    this.props.onChange(value);
  };

  render() {
    const { format, onChange, value, ...props } = this.props;
    const timeOptions = timeIntervals.map(minutes => {
      const time = moment(0)
        .utcOffset(0)
        .add(minutes, 'minutes');
      const inMs = minutes * 60 * 1000;

      return { label: time.format(format), value: inMs };
    });
    const selectedOption = timeOptions.find(option => option.value === value);

    return (
      <SelectPrimitive
        options={timeOptions}
        onChange={this.handleChange}
        value={selectedOption}
        {...props}
      />
    );
  }
}

class _TimePickerSelect extends Component<TimePickerSelectProps> {
  // We trigger an onBlur event when menu closes to trigger Formik validation
  handleMenuClose = (e: Event) => {
    this.props.onBlur(e);
  };

  render() {
    return (
      <TimePickerSelectPrimitive
        onMenuClose={this.handleMenuClose}
        {...this.props}
      />
    );
  }
}

export const TimePickerSelect = formikProxy(_TimePickerSelect);
