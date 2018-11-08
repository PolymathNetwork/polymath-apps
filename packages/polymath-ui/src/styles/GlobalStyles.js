import { createGlobalStyle } from 'styled-components';

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
