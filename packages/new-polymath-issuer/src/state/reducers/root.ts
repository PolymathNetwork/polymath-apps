import { reducer as entitiesReducer } from '~/state/reducers/entities';
import { reducer as sessionReducer } from '~/state/reducers/session';
import { reducer as appReducer } from '~/state/reducers/app';
import { reducer as dataRequestsReducer } from '~/state/reducers/dataRequests';
import { routerReducer } from '~/routing';

import { combineReducers } from 'redux';

export const reducer = combineReducers({
  entities: entitiesReducer,
  dataRequests: dataRequestsReducer,
  session: sessionReducer,
  app: appReducer,
  router: routerReducer,
});

export type RootState = ReturnType<typeof reducer>;
