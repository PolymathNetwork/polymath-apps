import createSagaMiddleware from 'redux-saga';
import { initializeCurrentLocation } from 'redux-little-router';
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Middleware,
} from 'redux';
import { rootSaga } from '~/state/sagas/root';
import { reducer as entitiesReducer } from '~/state/reducers/entities';
import { reducer as sessionReducer } from '~/state/reducers/session';
import { reducer as appReducer } from '~/state/reducers/app';
import { reducer as dataRequestsReducer } from '~/state/reducers/dataRequests';
import { routerEnhancer, routerMiddleware, routerReducer } from '~/routing';

export const rootReducer = combineReducers({
  entities: entitiesReducer,
  dataRequests: dataRequestsReducer,
  session: sessionReducer,
  app: appReducer,
  router: routerReducer,
});

const windowObj = window as any;

const sagaMiddleware = createSagaMiddleware();
const middleware: Middleware[] = [sagaMiddleware];

const hasReduxDevtools =
  typeof windowObj === 'object' &&
  (windowObj as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const composeEnhancers = hasReduxDevtools
  ? windowObj.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : compose;

const enhancer = composeEnhancers(
  routerEnhancer,
  applyMiddleware(...middleware, routerMiddleware)
);

export const store = createStore(rootReducer, enhancer);

sagaMiddleware.run(rootSaga);

// Initialize location state in router
const initialRouterState = store.getState().router;
store.dispatch(initializeCurrentLocation(initialRouterState));

export interface RootState extends ReturnType<typeof store.getState> {}
