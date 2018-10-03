// @flow

import { compose, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import type { RootState } from './reducer';
import reducer from './reducer';

const composedStore = compose(
  connectRouter(history)(rootReducer),
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const configureStore = (initialState?: RootState) =>
  composedStore(reducer, initialState);

export default configureStore;
