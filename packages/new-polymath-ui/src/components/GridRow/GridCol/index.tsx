import styled from 'styled-components';
import { style } from 'styled-system';
import { ResponsiveValue } from '~/styles/types';
import { Grid } from '~/components/Grid';

const gridSpan = style({
  prop: 'gridSpan',
  cssProperty: 'grid-column',
  transformValue: n => `auto / span ${n}`,
});

export interface GridColProps {
  gridSpan?: number | ResponsiveValue<number>;
}

export const GridCol = styled(Grid.Item)<GridColProps>`
  ${gridSpan};
`;
