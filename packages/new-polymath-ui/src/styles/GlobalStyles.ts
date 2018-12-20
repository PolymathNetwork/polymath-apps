import { normalize } from 'polished';
import fontFaceDefinition from 'typeface-overpass';

import { createGlobalStyle } from '~/styles';

export const GlobalStyles = createGlobalStyle`
  ${normalize()}

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
