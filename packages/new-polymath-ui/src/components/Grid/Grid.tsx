import React, { FC, Component } from 'react';
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

import { Box } from '~/components/Box';
import { GridCol } from '~/components/Grid/GridCol';
import { GridRow } from './GridRow';
import { typeHelpers } from '@polymathnetwork/new-shared';

export type GridProps = GridGapProps &
  GridAutoFlowProps &
  GridAutoFlowProps &
  GridTemplatesColumnsProps &
  GridTemplatesAreasProps &
  GridAutoColumnsProps &
  GridAutoRowsProps &
  AlignItemsProps &
  JustifyItemsProps &
  JustifyContentProps;

class GridBase extends Component<GridProps> {
  public static defaultProps = {
    gridGap: 'gridGap',
  };
  public static Col = GridCol;
  public static Row = GridRow;

  public render() {
    return <Box {...this.props} />;
  }
}

const EnhancedGrid = styled(GridBase)<GridProps>`
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

const TempGridRow: FC<any> = () => <div />;

export const Grid = Object.assign(EnhancedGrid, {
  defaultProps: EnhancedGrid.defaultProps,
  // FIXME @RafaelVidaurre: Temporary component for row, Add the real one when it doesn't depend on its parent
  Row: TempGridRow,
  Col: GridCol,
});
