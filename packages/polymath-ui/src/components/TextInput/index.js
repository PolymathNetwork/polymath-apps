import React from 'react';
import styled from 'styled-components';

const InputText = styled.input`
  font-size: ${({ theme }) => theme.fontSizes[1]}px;
  display: block;
  width: 100%;
  height: 2.5rem;
  min-width: 18.75rem;
  padding: 0 1rem;
  color: ${({ theme }) => theme.colors.baseText};
  background-color: ${({ theme }) => theme.colors.blue[0]};
  border: none;
  order: 2;
  border-bottom: 1px solid transparent;
  // transition: all ${({ theme }) => theme.transitions.hover};

  // :focus {
  //   background-color: ${({ theme }) => theme.colors.gray[0]};
  // }
`;

export default ({ type = 'text', ...props }) => (
  <InputText type={type} {...props} />
);
