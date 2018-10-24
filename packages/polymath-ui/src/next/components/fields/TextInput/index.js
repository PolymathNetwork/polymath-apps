import React from 'react';
import { TextInput } from 'carbon-components-react';

import type { InputProps } from '../types';

export default (props: InputProps) => {
  const {
    field,
    field: { value, ...fieldProps },
    form,
    form: { errors, touched },
    label,
    className,
    ...otherProps
  } = props;

  const error = touched[field.name] && errors[field.name];
  const invalid = error && touched;

  return (
    <TextInput
      id={field.name}
      invalid={invalid}
      invalidText={error}
      labelText={label}
      value={value || ''}
      {...otherProps}
      {...fieldProps}
    />
  );
};
