import React from 'react';
import styled from 'styled-components';

import { Card, CardProps } from '../Card';

export interface CardPrimaryProps extends CardProps {}

export const CardPrimary = styled(Card)<CardPrimaryProps>`
  color: ${({ theme }) => theme.colors.highlightText};
  background-color: ${({ theme }) => theme.colors.gray[1]};
`;

CardPrimary.defaultProps = {
  rounded: true,
  p: 1,
};

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const CardPrimaryDocz = (props: CardPrimaryProps) => {
  return <CardPrimary {...props} />;
};
