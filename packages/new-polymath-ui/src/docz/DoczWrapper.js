import React from 'react';
import { ThemeProvider } from 'styled-components';

import * as theme from '../styles/theme';
import { GlobalStyles } from '../styles/GlobalStyles';

const Wrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    <div>
      {children}
      <GlobalStyles />
    </div>
  </ThemeProvider>
);

export default Wrapper;
