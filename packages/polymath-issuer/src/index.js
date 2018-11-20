// @flow

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { ThemeProvider } from 'styled-components';
import { theme } from '@polymathnetwork/ui';
import * as Sentry from '@sentry/browser';

import Root from './components/Root';
import store, { history } from './redux/store';
import { unregister } from './registerServiceWorker';

import { SENTRY_KEY } from './constants';
import routes from './routes';

// $FlowFixMe
import './style.scss';

unregister();

if (process.env.NODE_ENV === 'production') {
  // Init error monitoring tool
  Sentry.init({
    dsn: SENTRY_KEY,
    environment: process.env.REACT_APP_DEPLOYMENT_STAGE,
  });
}

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ThemeProvider theme={theme}>
        <Root routes={routes} history={history} />
      </ThemeProvider>
    </ConnectedRouter>
  </Provider>,
  ((document.getElementById('root'): any): HTMLElement)
);
