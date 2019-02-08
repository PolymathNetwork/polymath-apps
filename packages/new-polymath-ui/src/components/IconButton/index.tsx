import React, { FC } from 'react';
import styled from 'styled-components';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Icon } from '../Icon';

type IconProps = typeHelpers.GetProps<typeof Icon>;

export interface IconButtonProps extends IconProps {}

const Button = styled.button`
  appearance: none;
  border: none;
  padding: 0;
  background-color: transparent;
`;

const StyledIcon = styled(Icon)`
  display: block;
`;

export const IconButton: FC<IconButtonProps> = ({
  Asset,
  children,
  ...props
}) => (
  <Button>
    <StyledIcon Asset={Asset} {...props} />
    {children}
  </Button>
);
