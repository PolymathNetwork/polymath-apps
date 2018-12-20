import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';

import { constants } from '@polymathnetwork/new-shared';

export interface LabelProps {
  color: string;
}

export const Label = styled.span<LabelProps>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  line-height: ${({ theme }) => theme.lineHeights.none};
  font-size: ${({ theme }) => theme.fontSizes[0]};
  background-color: ${({ color, theme }) => theme.colors[color]};
  color: ${({ color, theme }) => darken(0.6, theme.colors[color])};
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const LabelDocz = (props: LabelProps) => {
  return <Label {...props} />;
};
