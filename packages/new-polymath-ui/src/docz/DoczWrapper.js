import React from 'react';
import { ThemeProvider, GlobalStyles } from '~/styles';

const Wrapper = ({ children }) => (
  <ThemeProvider>
    <div>
      {children}
      <GlobalStyles />
    </div>
  </ThemeProvider>
);

export default Wrapper;
