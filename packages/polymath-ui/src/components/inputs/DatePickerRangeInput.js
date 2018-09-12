// @flow

import React from 'react';
import { DatePicker, DatePickerInput } from 'carbon-components-react';

type Props = {
  input: {
    name: string,
    onChange: any => void,
    onBlur: () => void,
  },
  label: string,
  meta: {
    touched: boolean,
    error: string,
  },
  className: string,
  placeholder: string,
};

const doNothing = () => {};

export default ({
  input: { name, onChange, onBlur },
  label,
  meta: { touched, error },
  className,
  placeholder,
  ...rest
}: Props) => {
  const [idStart, idEnd] = name.split('-');
  const [labelStart, labelEnd] = label.split(';');
  const invalid = touched && !!error;
  return (
    <DatePicker
      id={name}
      className={className}
      datePickerType="range"
      // eslint-disable-next-line
      onChange={(dates: Array<Date>) => {
        if (dates.length < 2) {
          // DatePicker can return an array of one while you're in the process
          // of selecting a range.
          return;
        }
        onChange(dates || null);
        // redux-form updates `touched` on blur.
        onBlur();
      }}
      {...rest}
    >
      <DatePickerInput
        onChange={doNothing}
        onClick={doNothing}
        labelText={labelStart}
        placeholder={placeholder}
        id={idStart}
        invalid={invalid}
        invalidText={error}
        pattern={null}
      />
      <DatePickerInput
        onChange={doNothing}
        onClick={doNothing}
        labelText={labelEnd}
        placeholder={placeholder}
        id={idEnd}
        invalid={invalid}
        pattern={null}
      />
    </DatePicker>
  );
};
