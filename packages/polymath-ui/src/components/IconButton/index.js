import React from 'react';
import { styled, Button } from 'reakit';

import BaseIcon from '../Icon';

const StyledIcon = styled(BaseIcon)`
  display: block;
  width: 100%;
  height: 100%;
`;

const IconButton = ({ Icon, ...props }) => (
  <Button {...props}>
    <StyledIcon Icon={Icon} />
  </Button>
);

export default IconButton;
