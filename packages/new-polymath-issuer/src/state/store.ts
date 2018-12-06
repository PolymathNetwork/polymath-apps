import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, compose, createStore, Middleware } from 'redux';
import { rootReducer } from '~/state/reducers/root';
import { rootSaga } from '~/state/sagas/root';

const windowObj = window as any;

const sagaMiddleware = createSagaMiddleware();
const middleware: Middleware[] = [sagaMiddleware];

const hasReduxDevtools =
  typeof windowObj === 'object' &&
  (windowObj as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const composeEnhancers = hasReduxDevtools
  ? windowObj.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));

export const store = createStore(rootReducer, enhancer);

sagaMiddleware.run(rootSaga);
