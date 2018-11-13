import { createGlobalStyle } from 'styled-components';

import 'typeface-overpass';

import '../deprecated/styles/globals.scss';

const GlobalStyles = createGlobalStyle`
  body {
    color: ${({ theme }) => theme.colors.baseText};
    font-family: 'Overpass', sans-serif;
    background-color: white;
    line-height: 1;
  }

  *:focus {
    outline: 0 !important;
  }
`;

export default GlobalStyles;
