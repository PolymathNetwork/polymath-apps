import React, { FC } from 'react';
import styled from 'styled-components';

import { Context } from '../Context';

const InputLabel = styled.label`
  display: block;
  color: ${({ theme }) => theme.colors.highlightText};
  font-size: ${({ theme }) => theme.fontSizes.baseText};
  margin-bottom: 0.5rem;
  font-weight: 600;
  line-height: 22px;
`;

export const Label: FC = ({ children }) => (
  <Context.Consumer>
    {({ name }) => <InputLabel htmlFor={name}>{children}</InputLabel>}
  </Context.Consumer>
);
