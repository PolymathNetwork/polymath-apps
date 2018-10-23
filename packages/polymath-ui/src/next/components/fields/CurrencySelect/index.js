import React, { Component } from 'react';
import { TextInput } from 'carbon-components-react';

import type { InputProps } from '../types';

export default (props: InputProps) => {
  const {
    field,
    form: { errors, touched },
    label,
    className,
    ...otherProps
  } = props;

  const error = touched[field.name] && errors[field.name];
  const invalid = error && touched;

  return (
    // <TextInput
    //   invalid={invalid}
    //   invalidText={error}
    //   {...otherProps}
    //   {...field}
    // />
    <div>Pending...</div>
  );
};
