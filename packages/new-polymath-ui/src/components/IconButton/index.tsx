import React, { FC } from 'react';
import styled from 'styled-components';

import { Icon, IconProps } from '../Icon';

export interface IconButtonProps extends IconProps {}

const Button = styled.button`
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

export const IconButton: FC<IconButtonProps> = ({ Asset, ...props }) => (
  <Button {...props}>
    <StyledIcon Asset={Asset} />
  </Button>
);
