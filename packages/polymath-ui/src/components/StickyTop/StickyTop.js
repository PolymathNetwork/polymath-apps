// @flow

import styled from 'styled-components';
import { style } from 'styled-system';

const zIndex = style({
  // React prop name
  prop: 'zIndex',
  // The corresponding CSS property (defaults to prop argument)
  cssProperty: 'zIndex',
  // key for theme values
  key: 'zIndexes',
});

const StickyTop = styled.div`
  position: sticky;
  top: 0;
  bottom: auto;
  ${zIndex};
`;

export default StickyTop;
