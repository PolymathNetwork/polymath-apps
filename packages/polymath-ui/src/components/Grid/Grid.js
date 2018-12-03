// @flow

import styled from 'styled-components';
import {
  gridGap,
  gridAutoFlow,
  gridTemplateColumns,
  gridAutoColumns,
  alignItems,
  justifyContent,
} from 'styled-system';

import Box from '../Box';

const Grid = styled(Box)`
  display: grid;
  ${gridGap};
  ${gridAutoFlow};
  ${gridTemplateColumns};
  ${gridAutoColumns};
  ${alignItems};
  ${justifyContent};
`;

Grid.defaultProps = {
  gridGap: 20,
};

export default Grid;
