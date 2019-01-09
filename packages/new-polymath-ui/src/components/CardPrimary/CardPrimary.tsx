import React from 'react';
import styled from 'styled-components';

import { Box, BoxProps } from '../Box';

export interface CardPrimaryProps extends BoxProps {}

export const CardPrimary = styled(Box)<CardPrimaryProps>`
  background-color: ${({ theme }) => theme.colors.gray[1]};
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  border-radius: 4px;
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const CardPrimaryDocz = (props: CardPrimaryProps) => {
  return <CardPrimary {...props} />;
};
