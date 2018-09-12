// @flow

import React from 'react';
import { TextArea } from 'carbon-components-react';
import type { Node } from 'react';

type Props = {
  input: {
    name: string,
  },
  label: string | Node,
  meta: {
    touched: boolean,
    error: string,
  },
  className: string,
};

export default ({
  input,
  label,
  meta: { touched, error },
  className,
  ...rest
}: Props) => {
  return (
    <TextArea
      {...input}
      id={input.name}
      labelText={label}
      invalid={touched && !!error}
      invalidText={error}
      className={className}
      {...rest}
    />
  );
};
