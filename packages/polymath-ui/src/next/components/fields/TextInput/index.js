import React from 'react';
import { get } from 'lodash';

import Field from '../../../../components/Field';
import TextInput from '../../../../components/TextInput';
import InputError from '../../../../components/InputError';
import InputLabel from '../../../../components/InputLabel';

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
    <Field>
      <InputLabel>{label}</InputLabel>
      <TextInput
        id={field.name}
        value={value || ''}
        {...otherProps}
        {...fieldProps}
      />
    </Field>
  );
};
