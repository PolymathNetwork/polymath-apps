import { createGlobalStyle } from 'styled-components';

import fontFaceDefinition from 'typeface-overpass';

import '../deprecated/styles/globals.scss';

const GlobalStyles = createGlobalStyle`
  ${fontFaceDefinition};

  body {
    position: relative;
    color: ${({ theme }) => theme.colors.baseText};
    font-family: ${({ theme }) => theme.fontFamilies.baseText};
    background-color: white;
    line-height: 1;
  }

  *:focus {
    outline: 0 !important;
  }

  p {
    font-size: inherit;
    margin-bottom: ${({ theme }) => theme.space.m};
  }

  strong {
    font-weight: ${({ theme }) => theme.fontWeights.bold};
  }

  img {
    max-width: 100%;
    height: auto;
  }

`;

export default GlobalStyles;
