import React from 'react';
import styled from 'styled-components';
import { gridColumn, gridRow, gridArea } from 'styled-system';

const GridItem = styled.div`
  ${gridColumn};
  ${gridRow};
  ${gridArea};
`;

GridItem.defaultProps = {};

export default GridItem;
