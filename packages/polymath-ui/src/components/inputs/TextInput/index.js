import React from 'react';

import BaseInput from '../BaseInput';

import type { InputProps } from '../types';

export default (props: InputProps) => {
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
