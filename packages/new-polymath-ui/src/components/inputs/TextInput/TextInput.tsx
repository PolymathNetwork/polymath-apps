import React, { FC } from 'react';

import { BaseInput } from '../BaseInput';

import { formikProxy } from '~/components/inputs/formikProxy';

interface Props {
  onChange: (e: any) => void;
  name: string;
  value: string;
}

export type TextInputProps = JSX.LibraryManagedAttributes<
  typeof TextInput,
  Props
>;

export const TextInputPrimitive: FC<Props> = props => {
  const { name, onChange, ...otherProps } = props;

  return (
    <BaseInput
      type="text"
      {...otherProps}
      id={name}
      onChange={e => {
        onChange(e.target.value);
      }}
    />
  );
};

TextInputPrimitive.defaultProps = {
  value: '',
};

const EnhancedTextInput = formikProxy(TextInputPrimitive);
export const TextInput = Object.assign(EnhancedTextInput, {
  defaultProps: TextInputPrimitive.defaultProps,
});
