import React from 'react';
import { get } from 'lodash';
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

  const isTouched = get(touched, field.name);
  const error = (isTouched && get(errors, field.name)) || null;
  const invalid = !!error;

  return (
    <NumberInput
      id={field.name}
      invalid={invalid}
      invalidText={error}
      label={label}
      value={value || ''}
      allowEmpty={true}
      {...otherProps}
      {...fieldProps}
    />
  );
};
