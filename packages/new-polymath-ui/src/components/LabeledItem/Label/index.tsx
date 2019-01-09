import React from 'react';
import styled from 'styled-components';

import { Paragraph } from '../../Paragraph';

export const Label = styled(({ children, ...props }) => (
  <Paragraph color="highlightText" mb={1} {...props}>
    <strong>{children}</strong>
  </Paragraph>
))`
  strong {
    font-weight: ${({ theme }) => theme.fontWeights.bold};
  }
`;

export const WrappedLabel: React.SFC = props => {
  return <Label {...props} />;
};
