import React from 'react';
import styled from 'styled-components';

import Box from '../Box';
import BaseIcon from '../Icon';

const Button = styled(Box)`
  appearance: none;
  border: none;
  padding: 0;
  background-color: transparent;
  transition: all ${({ theme }) => theme.transitions.hover.ms}ms;
`;

const StyledIcon = styled(BaseIcon)`
  display: block;
`;

const IconButton = ({ Icon, width, height, ...props }) => (
  <Button as="button" {...props}>
    <StyledIcon Icon={Icon} width={width} height={height} />
  </Button>
);

export default IconButton;
