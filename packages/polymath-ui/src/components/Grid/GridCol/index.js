import styled from 'styled-components';
import { style } from 'styled-system';

import GridItem from '../GridItem';

const gridSpan = style({
  prop: 'gridSpan',
  cssProperty: 'grid-column',
  transformValue: n => `auto / span ${n}`,
});

const GridCol = styled(GridItem)`
  ${gridSpan};
`;

GridCol.propTypes = {
  ...gridSpan.propTypes,
};

export default GridCol;
