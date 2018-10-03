// @flow

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import 'normalize.css/normalize.css';

import RouteLoader from './RouteLoader';
import store, { history } from './redux/store';
import { unregister } from './registerServiceWorker';

unregister();

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <RouteLoader />
    </ConnectedRouter>
  </Provider>,
  ((document.getElementById('root'): any): HTMLElement)
);
