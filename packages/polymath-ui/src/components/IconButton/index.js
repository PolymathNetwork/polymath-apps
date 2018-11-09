import React from 'react';
import styled from 'styled-components';

import Box from '../Box';
import BaseIcon from '../Icon';

const Button = styled(Box)`
  transition: all ${({ theme }) => theme.transitions.hover};
`;

const StyledIcon = styled(BaseIcon)`
  display: block;
  width: 100%;
  height: 100%;
`;

const IconButton = ({ Icon, ...props }) => (
  <Button as="button" {...props}>
    <StyledIcon Icon={Icon} />
  </Button>
);

export default IconButton;
