import { createGlobalStyle } from 'styled-components';

import fontFaceDefinition from 'typeface-overpass';

const GlobalStyles = createGlobalStyle`
  ${fontFaceDefinition};
`;

export default GlobalStyles;
