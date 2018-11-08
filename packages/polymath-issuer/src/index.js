// @flow

// Import Sass styles. Order is important.
// $FlowFixMe
import './style.scss';

import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyles } from '@polymathnetwork/ui';

import Root from './components/Root';
import store, { history } from './redux/store';
import { unregister } from './registerServiceWorker';

import routes from './routes';

unregister();

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ThemeProvider theme={theme}>
        <Fragment>
          <GlobalStyles />
          <Root routes={routes} history={history} />
        </Fragment>
      </ThemeProvider>
    </ConnectedRouter>
  </Provider>,
  ((document.getElementById('root'): any): HTMLElement)
);
