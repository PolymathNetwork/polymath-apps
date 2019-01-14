import * as React from 'react';
import { Provider } from 'react-redux';
import {
  ThemeProvider,
  GlobalStyles,
  ErrorBoundary,
} from '@polymathnetwork/new-ui';
import { store } from '~/state/store';
import { Pages } from '~/pages';

export const App = () => (
  <Provider store={store}>
    <ThemeProvider>
      <ErrorBoundary>
        <GlobalStyles />
        <Pages />
      </ErrorBoundary>
    </ThemeProvider>
  </Provider>
);
