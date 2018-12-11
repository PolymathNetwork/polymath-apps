import styled from 'styled-components';

import { Grid, GridProps } from '../Grid';

export const GridRow = styled(Grid)<GridProps>`
  grid-template-columns: repeat(12, 1fr);
`;
