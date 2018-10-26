// @flow

import React from 'react';
import { Select, SelectItem } from 'carbon-components-react';
import moment from 'moment';

type Props = {
  input: {
    name: string,
    value: TwelveHourTime,
    onChange: value => void,
  },
  label: string,
  meta: {
    touched: boolean,
    error: string,
  },
  className: string,
  placeholder: string,
  multi: boolean,
  beginLimit: string,
  endLimit: string,
  step: number,
  options: Array<Object>,
};

export default ({
  input,
  label,
  meta: { touched, error },
  className,
  placeholder,
  beginLimit,
  endLimit,
  step,
  ...rest
}: Props) => {
  var timeValue = beginLimit || '12:00 AM';
  var lastValue;
  endLimit = '11:59 PM';
  step = 30;

  var options = [];
  var isEarlierThanEndLimit = function(timeValue, endLimit, lastValue) {
    var timeValueIsEarlier =
      moment(timeValue, 'h:mm A').diff(moment(endLimit, 'h:mm A')) < 0;
    var timeValueIsLaterThanLastValue =
      lastValue === undefined
        ? true
        : moment(lastValue, 'h:mm A').diff(moment(timeValue, 'h:mm A')) < 0;
    return timeValueIsEarlier && timeValueIsLaterThanLastValue;
  };

  while (isEarlierThanEndLimit(timeValue, endLimit, lastValue)) {
    lastValue = timeValue;
    timeValue = moment(timeValue, 'h:mm A')
      .add(step, 'minutes')
      .format('h:mm A');
    options.push({ value: timeValue, label: timeValue });
  }

  return (
    <Select
      id={input.name}
      name={input.name}
      className={className}
      defaultValue="placeholder-item"
      invalid={touched && error}
      invalidText={error}
      labelText={label}
      // eslint-disable-next-line
      onChange={event => {
        const value = event.target.value;
        input.onChange(value || '');
        // redux-form updates `touched` on blur.
        input.onBlur();
      }}
      {...rest}
    >
      <SelectItem disabled hidden value="placeholder-item" text={placeholder} />
      {options.map(({ value, label }) => (
        <SelectItem key={value} value={value} text={label} />
      ))}
    </Select>
  );
};
