import React, { FC } from 'react';
import styled from 'styled-components';
import {
  gridGap,
  GridGapProps,
  gridAutoFlow,
  gridTemplateColumns,
  gridTemplateAreas,
  gridAutoColumns,
  gridAutoRows,
  alignItems,
  // @ts-ignore
  justifyItems,
  justifyContent,
  GridAutoFlowProps,
  GridTemplatesColumnsProps,
  GridTemplatesAreasProps,
  GridAutoColumnsProps,
  GridAutoRowsProps,
  AlignItemsProps,
  JustifyItemsProps,
  JustifyContentProps,
} from 'styled-system';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Box } from '~/components/Box';
import { GridItem } from './GridItem';

export type GridProps = typeHelpers.GetProps<typeof Box> &
  GridGapProps &
  GridAutoFlowProps &
  GridAutoFlowProps &
  GridTemplatesColumnsProps &
  GridTemplatesAreasProps &
  GridAutoColumnsProps &
  GridAutoRowsProps &
  AlignItemsProps &
  JustifyItemsProps &
  JustifyContentProps;

const GridBase = styled(Box)<GridProps>`
  display: grid;
  ${gridGap};
  ${gridAutoFlow};
  ${gridTemplateColumns};
  ${gridTemplateAreas};
  ${gridAutoColumns};
  ${gridAutoRows};
  ${alignItems};
  ${justifyContent};
  ${justifyItems};
`;

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const GridDocz: FC<GridProps> = props => {
  return <Grid {...props} />;
};

export const Grid = Object.assign(GridBase, {
  Item: GridItem,
});

Grid.defaultProps = {
  gridGap: 'gridGap',
};
