import styled from 'styled-components';
import {
  gridColumn,
  gridRow,
  gridArea,
  GridColumnProps,
  GridRowProps,
  GridAreaProps,
} from 'styled-system';

export type GridItemProps = GridColumnProps & GridRowProps & GridAreaProps;

export const GridItem = styled.div<GridItemProps>`
  ${gridColumn};
  ${gridRow};
  ${gridArea};
`;
