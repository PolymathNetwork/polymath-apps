// @flow

import React from 'react';
import {
  TimePicker as CarbonTimePicker,
  TimePickerSelect,
  SelectItem,
} from 'carbon-components-react';
import type { Node } from 'react';

export type TwelveHourTime = {
  timeString: string,
  dayPeriod: 'AM' | 'PM',
};

type Props = {
  input: {
    name: string,
    value: TwelveHourTime,
    onChange: (value: TwelveHourTime) => void,
    onBlur: (value: TwelveHourTime) => void,
  },
  label: Node,
  meta: {
    touched: boolean,
    error: string,
  },
  className: string,
};

export const twelveHourTimeToMinutes = (time: TwelveHourTime) => {
  const regex = /([^:]*):([^:]*)/;
  const match = regex.exec(time.timeString);

  if (match === null) {
    throw new Error('String passed is invalid');
  }

  let hours = parseInt(match[1], 10) % 12;

  if (time.dayPeriod === 'PM') {
    hours += 12;
  }

  return hours * 60 + parseInt(match[2], 10);
};

export default class TimePickerInput extends React.Component<Props> {
  handleTimeStringChange = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    this.props.input.onChange({
      ...this.props.input.value,
      timeString: event.target.value,
    });
  };

  handleTimeStringBlur = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    this.props.input.onBlur({
      ...this.props.input.value,
      timeString: event.target.value,
    });
  };

  handleDayPeriodChange = (event: Event) => {
    if (!(event.target instanceof HTMLSelectElement)) {
      return;
    }

    const dayPeriod = ((event.target.value: any): 'AM' | 'PM');

    this.props.input.onChange({
      ...this.props.input.value,
      dayPeriod,
    });
  };

  render() {
    const {
      input,
      label,
      meta: { touched, error },
      className,
      ...rest
    } = this.props;

    return (
      <CarbonTimePicker
        {...input}
        value={input.value.timeString}
        onChange={this.handleTimeStringChange}
        onBlur={this.handleTimeStringBlur} // redux-form uses onBlur to update the value
        id={input.name}
        labelText={label}
        invalid={touched && !!error}
        invalidText={error}
        className={className}
        {...rest}
      >
        <TimePickerSelect
          id={`${input.name}-select`}
          labelText="Choose AM or PM"
          value={input.value.dayPeriod}
          onChange={this.handleDayPeriodChange}
        >
          <SelectItem value="AM" text="AM" />
          <SelectItem value="PM" text="PM" />
        </TimePickerSelect>
      </CarbonTimePicker>
    );
  }
}
