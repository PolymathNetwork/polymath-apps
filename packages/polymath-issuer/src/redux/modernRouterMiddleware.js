import { push } from 'react-router-redux';

// NOTE @monitz87: this is a very primitive transformation from a redux-little-router push action which only
// considers the path name and ignores query strings and other special router options. This should
// be serviceable for now
export const modernRouterMiddleware = store => next => action => {
  if (action.type === 'ROUTER_PUSH') {
    return store.dispatch(push(action.payload.pathname));
  }

  return next(action);
};
