import React, { FC } from 'react';
import styled from 'styled-components';
import { InputError } from './InputError';
import { Label } from './Label';
import { Input } from './Input';
import { Context } from './Context';

interface Props {
  name: string;
}

const Wrapper = styled.div``;

const FormItemBase: FC<Props> = ({ name, children, ...props }) => {
  return (
    <Context.Provider value={{ name }}>
      <Wrapper {...props}>{children}</Wrapper>
    </Context.Provider>
  );
};

export const FormItem = Object.assign(FormItemBase, {
  Error: InputError,
  Label,
  Input,
});
