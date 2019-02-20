import React, { FC } from 'react';
import styled from 'styled-components';

import { InputError } from './InputError';
import { Label } from './Label';
import { Input } from './Input';
import { Context } from './Context';

interface Props {
  name: string;
  children?: React.ComponentType;
}

const Wrapper = styled.div`
  padding-bottom: 1.3rem;
  margin-right: 0.5rem;

  &:last-child {
    margin-right: 0;
  }
`;

const FormItemComponent: FC<Props> = ({ name, children, ...props }) => {
  return (
    <Context.Provider value={{ name }}>
      <Wrapper {...props}>{children}</Wrapper>
    </Context.Provider>
  );
};

export const FormItem = Object.assign(FormItemComponent, {
  Error: InputError,
  Label,
  Input,
});
