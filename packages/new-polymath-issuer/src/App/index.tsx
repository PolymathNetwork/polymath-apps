import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import {
  ThemeProvider,
  GlobalStyles,
  ErrorBoundary,
} from '@polymathnetwork/new-ui';
import { store } from '~/state/store';
import { Pages } from '~/pages';
import { ModalTransactionQueue } from '~/components';

export const App = () => (
  <Provider store={store}>
    <ThemeProvider>
      <Fragment>
        <GlobalStyles />
        <ErrorBoundary>
          <Pages />
          <ModalTransactionQueue />
        </ErrorBoundary>
      </Fragment>
    </ThemeProvider>
  </Provider>
);
