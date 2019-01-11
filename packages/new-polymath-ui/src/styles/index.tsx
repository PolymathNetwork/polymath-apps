import React from 'react';
import * as styledComponents from 'styled-components';
import { ThemedStyledComponentsModule } from 'styled-components';
import { ThemeInterface } from './types';
import { GlobalStyles } from './GlobalStyles';
import * as theme from './theme';

const {
  default: styled,
  css,
  createGlobalStyle,
  withTheme,
  keyframes,
} = styledComponents as ThemedStyledComponentsModule<ThemeInterface>;

const ScThemeProvider = styledComponents.ThemeProvider;

// Custom <ThemeProvider> component allows us to define a default theme
const ThemeProvider = ({ customTheme = theme, children }: any) => {
  return <ScThemeProvider theme={customTheme}>{children}</ScThemeProvider>;
};

export {
  css,
  createGlobalStyle,
  keyframes,
  GlobalStyles,
  ThemeProvider,
  withTheme,
  ThemeInterface,
};
export default styled;
