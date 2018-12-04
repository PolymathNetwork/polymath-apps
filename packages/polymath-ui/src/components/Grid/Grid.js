// @flow

import styled from 'styled-components';
import {
  gridGap,
  gridAutoFlow,
  gridTemplateColumns,
  gridTemplateAreas,
  gridAutoColumns,
  gridAutoRows,
  alignItems,
  justifyContent,
} from 'styled-system';

import Box from '../Box';

const Grid = styled(Box)`
  display: grid;
  ${gridGap};
  ${gridAutoFlow};
  ${gridTemplateColumns};
  ${gridTemplateAreas};
  ${gridAutoColumns};
  ${gridAutoRows};
  ${alignItems};
  ${justifyContent};
`;

Grid.defaultProps = {
  gridGap: 4,
};

export default Grid;
