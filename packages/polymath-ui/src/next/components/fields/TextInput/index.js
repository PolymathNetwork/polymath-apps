import React, { Fragment } from 'react';
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
    form: { errors, touched },
    label,
    className,
    ...otherProps
  } = props;

  const isTouched = get(touched, field.name);
  const error = (isTouched && get(errors, field.name)) || null;
  const invalid = !!error;

  return (
    <Field>
      <InputLabel>{label}</InputLabel>
      <TextInput
        id={field.name}
        invalid={invalid}
        value={value || ''}
        {...otherProps}
        {...fieldProps}
      />
      <InputError>{error}</InputError>
    </Field>
  );
};
