import { reducer as entitiesReducer } from '~/state/reducers/entities';
import { reducer as sessionReducer } from '~/state/reducers/session';
import { reducer as appReducer } from '~/state/reducers/app';
import { routerReducer } from '~/routing';

import { combineReducers } from 'redux';

export const reducer = combineReducers({
  entities: entitiesReducer,
  session: sessionReducer,
  app: appReducer,
  router: routerReducer,
});

export type RootState = ReturnType<typeof reducer>;
