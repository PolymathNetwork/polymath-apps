import React from 'react';
import styled, { css, StyledProps } from 'styled-components';

import { InputProps } from '../types';

export interface BaseInputProps extends InputProps {
  unit?: string;
}

const Wrapper = styled.div<BaseInputProps & StyledProps<any>>`
  ${({ unit }) =>
    unit &&
    css`
      position: relative;
    `};
`;

const Input = styled.input<BaseInputProps & StyledProps<any>>`
  display: block;
  width: 100%;
  box-sizing: border-box;
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

  /* Remove ugly handles on Chrome/Mozilla for number inputs (until mouse hover) */
  /* Only on desktop */

  @media screen and (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    -moz-appearance: textfield;

    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
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
  font-size: ${({ theme }) => theme.fontSizes.baseText};
  font-family: ${({ theme }) => theme.fontFamilies.baseText};
`;

export const BaseInput = React.forwardRef(
  ({ unit, ...props }: BaseInputProps, ref) => {
    return (
      <Wrapper unit={unit}>
        <Input ref={ref} {...props} />
        {unit && <Unit>{unit}</Unit>}
      </Wrapper>
    );
  }
);
