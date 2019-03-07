import React from 'react';
import styled from 'styled-components';
import { color as colorProp } from 'styled-system';

export interface HrProps {
  color?: string;
}

// export type HrProps = StyledProps<any> & WidthProps & HeightProps & SpaceProps;

export const Hr = styled.hr<HrProps>`
  width: 100%;
  ${colorProp};
  border: none;
  background: none;
  border-top: 1px solid currentColor;
  margin: ${({ theme }) => `calc(${theme.space.gridGap} / 2) auto`};
`;

Hr.defaultProps = {
  color: 'gray.1',
};
