import styled from 'styled-components';
import { style } from 'styled-system';
import { ResponsiveValue } from '~/styles/types';
import { Grid } from '~/components/Grid';

const gridSpan = style({
  prop: 'gridSpan',
  cssProperty: 'grid-column',
  transformValue: n => `auto / span ${n}`,
});

export interface Props {
  gridSpan?: number | ResponsiveValue<number>;
}

export const Col = styled(Grid.Item)<Props>`
  ${gridSpan};
`;
