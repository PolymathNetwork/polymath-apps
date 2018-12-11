import React from 'react';
import styled, { css } from 'styled-components';

import { InputProps } from '../types';

export interface BaseInputProps extends InputProps {
  unit?: boolean;
}

const Container = styled.div<BaseInputProps>`
  ${({ unit }) =>
    unit &&
    css`
      position: relative;
    `};
`;

const Input = styled.input<BaseInputProps>`
  display: block;
  width: 100%;
  height: 2.5rem;
  min-width: 18.75rem;
  padding: 0 1rem;
  font-size: ${({ theme }) => theme.fontSizes.baseText};
  color: ${({ theme }) => theme.colors.baseText};
  font-family: ${({ theme }) => theme.fontFamilies.baseText};
  background-color: ${({ theme }) => theme.colors.gray[1]};
  border: none;
  order: 2;
  border-bottom: 1px solid transparent;
  padding-right: ${({ unit }) => unit && '50px'};
  transition: all ${({ theme }) => theme.transitions.hover.ms}ms;

  :focus {
    background-color: ${({ theme }) => theme.colors.gray[0]};
  }
`;

const Unit = styled.span`
  display: flex;
  position: absolute;
  right: 1rem;
  top: 0;
  height: 100%;
  justify-content: center;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.placeholder};
`;

export const BaseInput = ({ unit, ...props }: BaseInputProps) => {
  return (
    <Container unit={unit}>
      <Input data-testid="base-input" unit={unit} {...props} />
      {unit && <Unit>{unit}</Unit>}
    </Container>
  );
};
