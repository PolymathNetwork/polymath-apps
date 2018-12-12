import { createGlobalStyle } from 'styled-components';

import fontFaceDefinition from 'typeface-overpass';

export const GlobalStyles = createGlobalStyle`
  ${fontFaceDefinition};

  *:focus:not(:focus-visible) {
    outline: none;
  }

  body {
    background-color: white;
    color: ${({ theme }) => theme.colors.baseText};
    font-family: ${({ theme }) => theme.fontFamilies.baseText};
  }
`;
