// @flow

// Import Sass styles. Order is important.
// $FlowFixMe
import './app/style.scss';

import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStyles } from '@polymathnetwork/ui';

import 'normalize.css/normalize.css';

import RouteLoader from './RouteLoader';
import configureStore from './redux/store';
import { unregister } from './registerServiceWorker';

unregister();

const store = configureStore();

render(
  <Provider store={store}>
    <BrowserRouter>
      <Fragment>
        <GlobalStyles />
        <RouteLoader />
      </Fragment>
    </BrowserRouter>
  </Provider>,
  ((document.getElementById('root'): any): HTMLElement)
);
