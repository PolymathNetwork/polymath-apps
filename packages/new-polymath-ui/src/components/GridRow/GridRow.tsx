import styled from 'styled-components';
import { Grid } from '~/components/Grid';
import { GridCol } from './GridCol';

const GridRowBase = styled(Grid)`
  grid-template-columns: repeat(12, 1fr);
`;

export const GridRow = Object.assign(GridRowBase, {
  Col: GridCol,
});
