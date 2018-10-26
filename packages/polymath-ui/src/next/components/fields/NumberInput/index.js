import React from 'react';
import styled from 'styled-components';

import Field from '../../../../components/Field';
import TextInput from '../../../../components/TextInput';
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
    label,
    className,
    ...otherProps
  } = props;

  return (
    <Field>
      <InputLabel>{label}</InputLabel>
      <NumberInput
        type="number"
        id={field.name}
        value={typeof value === 'number' ? value : ''}
        allowEmpty={true}
        {...otherProps}
        {...fieldProps}
      />
    </Field>
  );
};
