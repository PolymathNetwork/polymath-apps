// @flow
/* eslint-disable react/jsx-no-bind, no-useless-escape */

import React from 'react';
import { DatePicker, DatePickerInput } from 'carbon-components-react';

type Props = {
  input: {
    name: string,
    onChange: any => void,
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
  input,
  label,
  meta: { touched, error },
  className,
  ...rest
}: Props) => {
  const invalid = touched && !!error;
  return (
    <DatePicker
      id={input.name}
      className={className}
      datePickerType="single"
      // eslint-disable-next-line
      onChange={(date: Date) => {
        input.onChange(date || null);
      }}
      dateFormat="m / d / Y"
    >
      <DatePickerInput
        labelText={label}
        placeholder="mm / dd / yyyy"
        id={input.name}
        invalid={invalid}
        invalidText={error}
        onClick={() => {}}
        onChange={() => {}}
        pattern={null}
        {...rest}
      />
    </DatePicker>
  );
};
