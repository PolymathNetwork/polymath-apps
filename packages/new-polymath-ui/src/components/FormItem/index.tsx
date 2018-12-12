import * as React from 'react';
import styled from 'styled-components';

import { InputError } from './InputError';
import { Label } from './Label';
import { Input } from './Input';

type Props = {
  name: string;
  children?: React.ComponentType;
};

export const FormItemContext = React.createContext();

const Container = styled.div`
  padding-bottom: 1.3rem;
  margin-right: 0.5rem;

  &:last-child {
    margin-right: 0;
  }
`;

export const FormItem = ({ name, children, ...props }: Props) => {
  return (
    <FormItemContext.Provider value={{ name }}>
      <Container {...props}>{children}</Container>
    </FormItemContext.Provider>
  );
};

Object.assign(FormItem, {
  Error: InputError,
  Label: Label,
  Input: Input,
});
