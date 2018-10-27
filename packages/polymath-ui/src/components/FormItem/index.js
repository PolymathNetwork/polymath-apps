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
  margin-bottom: 5px;
  padding-bottom: 1.3rem;
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
