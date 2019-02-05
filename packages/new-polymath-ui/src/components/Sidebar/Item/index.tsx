import React, { FC } from 'react';
import { StyledProps } from 'styled-components';
import { styled } from '~/styles';

const Container = styled.li`
  width: 68px;
  height: 64px;
  margin-bottom: 2px;
  border-left: 8px solid transparent;
  margin-left: -4px;
  padding-top: 9px;
  text-align: center;

  &:hover:not(.disabled),
  &.active {
    background-color: rgba(61, 112, 178, 0.2);
    border-left-color: #5596e6;

    g,
    path {
      fill: #5596e6;
    }

    p {
      color: #5596e6;
    }
  }

  &.disabled {
    opacity: 0.5;
  }

  svg {
    display: inline-flex;
    height: 27px;
  }

  p {
    color: white;
    font-weight: 300;
    font-size: 11px;
    line-height: 18px;
    margin-top: -2px;
    letter-spacing: -0.2px;
  }

  a {
    text-decoration: none;
  }
`;
const Inner = styled.span``;

export const Item: FC<StyledProps<any>> = ({ children, ...props }) => (
  <Container>
    <Inner {...props}>{children}</Inner>
  </Container>
);
