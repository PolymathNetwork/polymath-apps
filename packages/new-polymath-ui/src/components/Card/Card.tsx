import React from 'react';
import styled from 'styled-components';
import { boxShadow, BoxShadowProps } from 'styled-system';

import { Box, BoxProps } from '~/components/Box';

export interface CardProps extends BoxProps {
  boxShadow: BoxShadowProps;
  rounded: boolean;
}

export const StyledCard = styled(Box)<CardProps>`
  background-color: white;
  ${boxShadow};
  border-radius: ${({ rounded }) => rounded && '4px'};
`;

export const Card = Object.assign(StyledCard, {
  defaultProps: {
    rounded: false,
    boxShadow: 2,
    p: 'xl',
  },
});

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const CardDocz = (props: CardProps) => {
  return <Card {...props} />;
};
