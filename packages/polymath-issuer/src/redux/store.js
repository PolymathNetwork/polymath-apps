// @flow

import { compose, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import reducer from './reducer';

export const history = createBrowserHistory();

const store = createStore(
  connectRouter(history)(reducer),
  {}, // initial state
  compose(
    applyMiddleware(thunk, routerMiddleware(history)),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

export default store;
