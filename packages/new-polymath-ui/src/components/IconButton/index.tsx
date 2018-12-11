import React from 'react';
import styled from 'styled-components';

import { Box } from '../Box';
import { Icon } from '../Icon';

const Button = styled(Box)`
  appearance: none;
  border: none;
  padding: 0;
  background-color: transparent;
  transition: all ${({ theme }) => theme.transitions.hover.ms}ms;
`;

const StyledIcon = styled(Icon)`
  display: block;
  width: 100%;
  height: 100%;
`;

export const IconButton = ({ Asset, ...props }) => (
  <Button as="button" {...props}>
    <StyledIcon Asset={Asset} />
  </Button>
);
