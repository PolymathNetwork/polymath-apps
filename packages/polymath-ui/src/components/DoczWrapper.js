import React from 'react';
import { ThemeProvider } from 'styled-components';

import '../styles/globals.scss';

import theme from '../theme';

const Wrapper = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Wrapper;
