import React from 'react';
import styled from 'styled-components';

import { Card, CardProps } from '../Card';

export interface CardPrimaryProps extends CardProps {}

export const CardPrimary = styled(Card)<CardPrimaryProps>`
  background-color: ${({ theme }) => theme.colors.gray[1]};
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
`;

CardPrimary.defaultProps = {
  rounded: true,
};

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const CardPrimaryDocz = (props: CardPrimaryProps) => {
  return <CardPrimary {...props} />;
};
