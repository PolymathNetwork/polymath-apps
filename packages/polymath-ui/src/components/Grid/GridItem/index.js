import React from 'react';
import styled from 'styled-components';
import { gridColumn, gridRow } from 'styled-system';

const GridItem = styled.div`
  ${gridColumn};
  ${gridRow};
`;

GridItem.defaultProps = {};

export default GridItem;
