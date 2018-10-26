// @flow

import React from 'react';
import { RadioButtonGroup, RadioButton } from 'carbon-components-react';

type Props = {
  input: {
    name: string,
    value: string,
    onChange: any => void,
  },
  className: string,
  placeholder: string,
  options: Array<Object>,
};

const RadioInput = ({
  input,
  options,
  className,
  placeholder,
  ...rest
}: Props) => {
  return (
    <RadioButtonGroup
      id={input.name}
      name={input.name}
      className={className}
      // eslint-disable-next-line
      onChange={value => {
        return input.onChange(value || '');
      }}
      defaultSelected={options[0].value}
      {...rest}
    >
      {options.map(({ value, label }) => (
        <RadioButton
          key={value}
          value={value}
          id={input.name + '-' + value}
          labelText={label}
        />
      ))}
    </RadioButtonGroup>
  );
};

export default RadioInput;
