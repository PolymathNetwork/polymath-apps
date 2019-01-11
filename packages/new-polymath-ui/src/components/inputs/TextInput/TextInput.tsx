import React, { FC } from 'react';

import { BaseInput } from '../BaseInput';

import { InputProps } from '../types';
import { formikProxy } from '~/components/inputs/formikProxy';

interface Props {
  name: string;
  value: string;
}

export type TextInputProps = JSX.LibraryManagedAttributes<
  typeof TextInput,
  Props
>;

export const TextInputPrimitive: FC<Props> = props => {
  const { name, ...otherProps } = props;

  return <BaseInput type="text" {...otherProps} id={name} />;
};

TextInputPrimitive.defaultProps = {
  value: '',
};

const EnhancedTextInput = formikProxy(TextInputPrimitive);
export const TextInput = Object.assign(EnhancedTextInput, {
  defaultProps: TextInputPrimitive.defaultProps,
});
