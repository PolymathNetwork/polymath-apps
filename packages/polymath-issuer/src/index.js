// @flow

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import Root from './components/Root';
import store, { history } from './redux/store';
import { unregister } from './registerServiceWorker';

import routes from './routes';

// $FlowFixMe
import './style.scss';

unregister();

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Root routes={routes} history={history} />
    </ConnectedRouter>
  </Provider>,
  ((document.getElementById('root'): any): HTMLElement)
);
