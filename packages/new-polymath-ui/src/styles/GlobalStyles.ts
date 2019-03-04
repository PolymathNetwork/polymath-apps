import { normalize } from 'polished';
import fontFaceDefinition from 'typeface-overpass';
import * as styledComponents from 'styled-components';
import { ThemedStyledComponentsModule } from 'styled-components';
import { ThemeInterface } from './types';

const { createGlobalStyle } = styledComponents as ThemedStyledComponentsModule<
  ThemeInterface
>;

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
    font-weight: ${({ theme }) => theme.fontWeights.normal};
  }

  strong {
    font-weight: ${({ theme }) => theme.fontWeights.strong};
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
