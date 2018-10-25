import React from 'react';
import styled from 'styled-components';

const InputError = styled.div`
  font-size: ${({ theme }) => theme.fontSizes[0]}px;
  color: ${({ theme }) => theme.colors.red[0]};
  order: 3;
  font-weight: 400;
  margin-top: 0.25rem;
  overflow: visible;
  line-height: 1.5;
`;

export default ({ children }) => <InputError>{children}</InputError>;
