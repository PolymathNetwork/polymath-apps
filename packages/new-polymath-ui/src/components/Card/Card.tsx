import React from 'react';
import styled from 'styled-components';

import { Box, BoxProps } from '../Box';

export interface CardProps extends BoxProps {}

export const Card = styled(Box)<CardProps>`
  background-color: white;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  padding: ${({ theme }) => theme.space[6]};
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const CardDocz = (props: CardProps) => {
  return <Card {...props} />;
};
