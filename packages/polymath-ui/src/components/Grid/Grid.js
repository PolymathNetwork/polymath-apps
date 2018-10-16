import React from 'react';
import styled from 'styled-components';
import {
  gridGap,
  gridAutoFlow,
  gridAutoColumns,
  alignItems,
} from 'styled-system';

const Box = styled.div`
  display: grid;
  ${gridGap};
  ${gridAutoFlow};
  ${gridAutoColumns};
  ${alignItems};
`;

const Grid = Box;

Grid.defaultProps = {
  gridGap: 20,
};

export default Grid;
