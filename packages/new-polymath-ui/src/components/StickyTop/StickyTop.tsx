import styled from 'styled-components';
import { style } from 'styled-system';

export interface StickyTopProps {
  zIndex: string;
}

const zIndex = style({
  // React prop name
  prop: 'zIndex',
  // The corresponding CSS property (defaults to prop argument)
  cssProperty: 'zIndex',
  // key for theme values
  key: 'zIndexes',
});

export const StickyTop = styled.div<StickyTopProps>`
  position: sticky;
  top: 0;
  bottom: auto;
  ${zIndex};
`;
