import React from 'react';
import styled from 'styled-components';
import { get } from 'lodash';

import Field from '../../../../components/Field';
import TextInput from '../../../../components/TextInput';
import InputError from '../../../../components/InputError';
import InputLabel from '../../../../components/InputLabel';

import type { InputProps } from '../types';

const NumberInput = styled(TextInput)`
  /* Remove ugly handles on Chrome/Mozilla for number inputs (until mouse hover) */
  /* Only on desktop */

  @media screen and (min-width: 768px) {
    -moz-appearance: textfield;

    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }
`;

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
      <NumberInput
        type="number"
        id={field.name}
        invalid={invalid}
        value={value || ''}
        allowEmpty={true}
        {...otherProps}
        {...fieldProps}
      />
      <InputError>{error}</InputError>
    </Field>
  );
};
