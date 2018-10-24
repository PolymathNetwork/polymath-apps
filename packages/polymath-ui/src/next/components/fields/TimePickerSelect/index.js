// @flow

import { range, get } from 'lodash';
import React from 'react';
import { Select, SelectItem } from 'carbon-components-react';
import moment from 'moment';
import type { InputProps } from '../types';

type OwnProps = {};

type Props = InputProps & OwnProps;

const minutesInADay = 60 * 24;
const timeIntervals = range(0, minutesInADay, 30);

const TimePickerSelectField = ({
  form: { name: formName, touched, errors },
  field,
  className,
  label,
  placeholder,
  ...props
}: Props) => {
  const isTouched = get(touched, field.name);
  const error = (isTouched && get(errors, field.name)) || null;
  const invalid = !!error;
  const timeOptions = timeIntervals.map(minutes => {
    const time = moment(0)
      .utcOffset(0)
      .add(minutes, 'minutes');

    const inMs = minutes * 60 * 1000;
    return { label: time.format('h:mm A'), value: inMs };
  });

  return (
    <Select
      id={field.name}
      className={className}
      defaultValue="placeholder-item"
      invalid={invalid}
      invalidText={error}
      labelText={label}
      {...field}
      {...props}
    >
      <SelectItem disabled value="placeholder-item" text={placeholder} />
      {timeOptions.map(({ value, label }) => (
        <SelectItem key={value} value={value} text={label} />
      ))}
    </Select>
  );
};

export default TimePickerSelectField;
