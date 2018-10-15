// @flow
/* eslint-disable react/jsx-no-bind, no-useless-escape */

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

export default ({
  input: { name, onChange, onBlur },
  label,
  meta: { touched, error },
  className,
  placeholder,
  ...rest
}: Props) => {
  const invalid = touched && !!error;
  return (
    <DatePicker
      id={name}
      className={className}
      datePickerType="single"
      // eslint-disable-next-line
      onChange={(date: Date) => {
        onChange(date || null);
        // redux-form updates `touched` on blur.
        onBlur();
      }}
      dateFormat="m / d / Y"
      {...rest}
    >
      <DatePickerInput
        labelText={label}
        placeholder="mm / dd / yyyy"
        id={name}
        invalid={invalid}
        invalidText={error}
        onClick={() => {}}
        onChange={() => {}}
        pattern={null}
      />
    </DatePicker>
  );
};
