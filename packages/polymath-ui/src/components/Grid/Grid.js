import React from 'react';
import styled from 'styled-components';
import {
  gridGap,
  gridAutoFlow,
  gridAutoColumns,
  alignItems,
} from 'styled-system';

import Box from '../Box';

const Grid = styled(Box)`
  display: grid;
  ${gridGap};
  ${gridAutoFlow};
  ${gridAutoColumns};
  ${alignItems};
`;

Grid.defaultProps = {
  gridGap: 20,
};

export default Grid;
