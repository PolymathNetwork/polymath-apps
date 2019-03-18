import { push } from 'react-router-redux';

// NOTE @monitz87: this is a very primitive transformation from a redux-little-router push action which only
// considers the path name and ignores query strings and other special router options. This should
// be serviceable for now
export const modernRouterMiddleware = store => next => action => {
  if (action.type === 'ROUTER_PUSH') {
    // NOTE @RafaelVidaurre: This hack is required due to a bug on react-router-redux
    // with the redux router config library. This is temporary and will not
    // be required when we move away from legacy
    store.dispatch(push(action.payload.pathname));
    return store.dispatch(push(action.payload.pathname));
  }

  return next(action);
};
