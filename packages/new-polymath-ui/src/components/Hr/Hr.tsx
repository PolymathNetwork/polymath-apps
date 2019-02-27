import React from 'react';
import styled from 'styled-components';
import { color as colorProp } from 'styled-system';

export interface HrProps {
  color: string;
}

// export type HrProps = StyledProps<any> & WidthProps & HeightProps & SpaceProps;

export const Hr = styled.hr<HrProps>`
  ${colorProp};
`;
