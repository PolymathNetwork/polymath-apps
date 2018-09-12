// @flow

import React from 'react';
import { Select, SelectItem } from 'carbon-components-react';

type Props = {
  input: {
    name: string,
    value: string,
    onChange: any => void,
  },
  label: string,
  className: string,
  placeholder: string,
  multi: boolean,
  options: Array<Object>,
};

export default ({
  input,
  options,
  label,
  className,
  placeholder,
  ...rest
}: Props) => {
  return (
    <Select
      id={input.name}
      name={input.name}
      className={className}
      defaultValue="placeholder-item"
      labelText={label}
      // eslint-disable-next-line
      onChange={event => {
        const value = event.target.value;
        return input.onChange(value || '');
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
