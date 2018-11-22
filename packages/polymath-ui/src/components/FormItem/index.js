// @flow
import * as React from 'react';
import styled from 'styled-components';

import InputError from './InputError';
import Label from './Label';
import Input from './Input';

type Props = {
  name: string,
  children?: React.Node,
};

export const FormItemContext = React.createContext();

const Container = styled.div`
  padding-bottom: 1.3rem;
  margin-right: 0.5rem;

  &:last-child {
    margin-right: 0;
  }
`;

const FormItem = ({ name, children, ...props }: Props) => {
  return (
    <FormItemContext.Provider value={{ name }}>
      <Container {...props}>{children}</Container>
    </FormItemContext.Provider>
  );
};

FormItem.Error = InputError;
FormItem.Label = Label;
FormItem.Input = Input;

export default FormItem;
