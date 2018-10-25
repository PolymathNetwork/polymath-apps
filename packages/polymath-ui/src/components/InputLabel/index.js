import React from 'react';
import styled from 'styled-components';

const InputLabel = styled.div`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes[1]}px;
  vertical-align: baseline;
  margin-bottom: 0.5rem;
  font-weight: 600;
  line-height: 22px;
  width: 100%;

  // TODO: @grsmto: remove this override when we get rid of Carbon tooltips (it has hardcoded font-size...).
  .bx--tooltip__trigger {
    font-size: ${({ theme }) => theme.fontSizes[1]}px;
  }
`;

export default ({ children }) => <InputLabel>{children}</InputLabel>;
