import React from 'react';
import { NumberInput } from 'carbon-components-react';

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

  console.log(field.name, invalid);
  console.log(touched);

  return (
    <NumberInput
      id={field.name}
      invalid={invalid}
      invalidText={error}
      label={label}
      value={value || ''}
      {...otherProps}
      {...fieldProps}
    />
  );
};
