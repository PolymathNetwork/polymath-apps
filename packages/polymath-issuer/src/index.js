// @flow

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { ThemeProvider } from 'styled-components';
import { theme } from '@polymathnetwork/ui';

import Root from './components/Root';
import store, { history } from './redux/store';
import { unregister } from './registerServiceWorker';

import routes from './routes';

// $FlowFixMe
import './style.scss';

console.log('process.env', process.env);

unregister();

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
