// @flow
import * as React from 'react';
import styled from 'styled-components';

import InputError from './InputError';
import Label from './Label';
import Input from './Input';

type Props = {
  className: string,
  name: string,
  children?: React.Node,
};

export const FormItemContext = React.createContext();

const FormItem = styled(({ className, name, children }: Props) => {
  return (
    <FormItemContext.Provider value={{ name }}>
      <div className={className}>{children}</div>
    </FormItemContext.Provider>
  );
})``;

FormItem.Error = InputError;
FormItem.Label = Label;
FormItem.Input = Input;

export default FormItem;
