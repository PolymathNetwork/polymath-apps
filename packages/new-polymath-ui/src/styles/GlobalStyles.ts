import { normalize } from 'polished';
import fontFaceDefinition from 'typeface-overpass';

import { createGlobalStyle } from '~/styles';

export const GlobalStyles = createGlobalStyle`
  ${normalize()}

  ${fontFaceDefinition};

  *, *:before, *:after {
    box-sizing: border-box;
  }

  *:focus:not(:focus-visible) {
    outline: none;
  }

  body {
    background-color: white;
    color: ${({ theme }) => theme.colors.baseText};
    font-family: ${({ theme }) => theme.fontFamilies.baseText};
  }

  button,
  input[type='button'],
  input[type='submit'],
  input[type='reset'],
  input[type='file'] {
    cursor: pointer;
    white-space: nowrap;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
`;
