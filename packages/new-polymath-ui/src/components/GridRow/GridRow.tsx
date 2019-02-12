import styled from 'styled-components';
import { Grid } from '~/components/Grid';
import { Col } from './Col';

const GridRowComponent = styled(Grid)`
  grid-template-columns: repeat(12, 1fr);
`;

export const GridRow = Object.assign(GridRowComponent, {
  Col,
});
