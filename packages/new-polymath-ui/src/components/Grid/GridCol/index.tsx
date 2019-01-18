import styled from 'styled-components';
import { style, SpaceProps } from 'styled-system';

import { GridItem } from '../GridItem';

const gridSpan = style({
  prop: 'gridSpan',
  cssProperty: 'grid-column',
  transformValue: n => `auto / span ${n}`,
});

export interface GridColProps {
  gridSpan?: SpaceProps;
}

export const GridCol = styled(GridItem)<GridColProps>`
  ${gridSpan};
`;
