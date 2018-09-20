// @flow

import React from 'react';
import { TextInput } from 'carbon-components-react';
import type { Node } from 'react';

type Props = {
  input: {
    name: string,
    onChange: any => void,
  },
  label: Node,
  type: string,
  meta: {
    touched: boolean,
    error: string,
  },
  className: string,
  onChangeCode: (value: string) => void,
};

export default ({
  input,
  label,
  type,
  meta: { touched, error },
  className,
  onChangeCode,
  ...rest
}: Props) => {
  return (
    <TextInput
      {...input}
      id={input.name}
      labelText={label}
      invalid={touched && !!error}
      invalidText={error}
      className={className}
      // eslint-disable-next-line
      onChange={event => {
        const value = event.target.value; // $FlowFixMe
        if (onChangeCode) {
          // $FlowFixMe
          onChangeCode(value);
        }
        if(type ==='email'){
          return input.onChange(value.trim() || '');
        }else{
          return input.onChange(value || '');
        } 
      }}
      {...rest}
    />
  );
};
