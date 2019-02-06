import React from 'react';
import styled from 'styled-components';
import { color as colorProp } from 'styled-system';
import { lighten } from 'polished';

export interface LabelProps {
  color: string;
  bg?: string;
}

export const Label = styled.span<LabelProps>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  line-height: ${({ theme }) => theme.lineHeights.none};
  font-size: ${({ theme }) => theme.fontSizes[0]};
  background-color: ${({ color, bg }) => bg || lighten(0.4, color)};
  ${colorProp};
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const LabelDocz = (props: LabelProps) => {
  return <Label {...props} />;
};
