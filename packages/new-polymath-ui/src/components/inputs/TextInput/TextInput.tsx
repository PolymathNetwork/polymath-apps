import React, { FC } from 'react';

import { BaseInput } from '../BaseInput';

import {
  EnhancedComponentProps,
  FormikProxy,
} from '~/components/inputs/FormikProxy';

interface Props {
  onChange: (e: string) => void;
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
        onChange(e.currentTarget.value);
      }}
    />
  );
};

TextInputPrimitive.defaultProps = {
  value: '',
};

const EnhancedTextInput: FC<EnhancedComponentProps<string>> = ({
  field,
  form,
  onChange,
  onBlur,
  ...rest
}) => (
  <FormikProxy<string>
    field={field}
    form={form}
    onChange={onChange}
    onBlur={onBlur}
    render={formikProps => <TextInputPrimitive {...rest} {...formikProps} />}
  />
);

export const TextInput = Object.assign(EnhancedTextInput, {
  defaultProps: TextInputPrimitive.defaultProps,
});
