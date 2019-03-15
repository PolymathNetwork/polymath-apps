// @flow
import createSagaMiddleware from 'redux-saga';
import { compose, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { rootSaga } from '@polymathnetwork/new-issuer/state/sagas/root';
import createRootReducer from './reducer';
import { modernRouterMiddleware } from './modernRouterMiddleware';
import modernAdapter from '../modernAdapters/reduxMiddleware';

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

const middleware = [
  thunk,
  modernRouterMiddleware,
  routerMiddleware(history),
  sagaMiddleware,
  modernAdapter,
];

const store = createStore(
  createRootReducer(history),
  {}, // initial state
  compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

// Initialize Modern dApp's Sagas
sagaMiddleware.run(rootSaga);

export default store;
