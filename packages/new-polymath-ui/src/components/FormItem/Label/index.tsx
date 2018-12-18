import React, { FC } from 'react';
import styled from 'styled-components';
import { FormItemContext } from '..';

const InputLabel = styled.label`
  display: block;
  color: ${({ theme }) => theme.colors.highlightText};
  font-size: ${({ theme }) => theme.fontSizes.baseText};
  margin-bottom: 0.5rem;
  font-weight: 600;
  line-height: 22px;

  // TODO: @grsmto: remove this override when we get rid of Carbon tooltips (it has hardcoded font-size...).
  .bx--tooltip__trigger {
    font-size: ${({ theme }) => theme.fontSizes.baseText};
  }
`;

export const Label: FC = ({ children }) => (
  <FormItemContext.Consumer>
    {({ name }) => <InputLabel htmlFor={name}>{children}</InputLabel>}
  </FormItemContext.Consumer>
);
