import React from 'react';
import styled from 'styled-components';

import { FormItemContext } from '../';

const InputLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes[1]}px;
  margin-bottom: 0.5rem;
  font-weight: 600;
  line-height: 22px;

  // TODO: @grsmto: remove this override when we get rid of Carbon tooltips (it has hardcoded font-size...).
  .bx--tooltip__trigger {
    font-size: ${({ theme }) => theme.fontSizes[1]}px;
  }
`;

export default ({ children }) => (
  <FormItemContext.Consumer>
    {({ name }) => <InputLabel htmlFor={name}>{children}</InputLabel>}
  </FormItemContext.Consumer>
);
