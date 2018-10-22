import React from 'react';
import styled from 'styled-components';

import Box from '../Box';
import BaseIcon from '../Icon';

const StyledIcon = styled(BaseIcon)`
  display: block;
  width: 100%;
  height: 100%;
`;

const IconButton = ({ Icon, ...props }) => (
  <Box as="button" {...props}>
    <StyledIcon Icon={Icon} />
  </Box>
);

export default IconButton;
