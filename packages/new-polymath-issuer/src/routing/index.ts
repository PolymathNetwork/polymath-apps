import { routerForBrowser } from 'redux-little-router';
import { routes } from './routes';

const {
  reducer: routerReducer,
  middleware: routerMiddleware,
  enhancer: routerEnhancer,
} = routerForBrowser({ routes });

export { routerReducer, routerMiddleware, routerEnhancer, routes };
