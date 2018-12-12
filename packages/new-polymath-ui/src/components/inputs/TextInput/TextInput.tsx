import React from 'react';

import { BaseInput } from '../BaseInput';

import { InputProps } from '../types';

export const TextInput = (props: InputProps) => {
  const {
    field,
    field: { value, ...fieldProps },
    form,
    label,
    className,
    ...otherProps
  } = props;

  return (
    <BaseInput
      id={field.name}
      value={value || ''}
      {...otherProps}
      {...fieldProps}
    />
  );
};
