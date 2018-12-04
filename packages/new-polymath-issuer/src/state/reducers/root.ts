import { combineReducers } from 'redux';
import { reducer as entitiesReducer } from './entities';
import { reducer as sessionReducer } from './session';
import { reducer as appReducer } from './app';

export const rootReducer = combineReducers({
  entities: entitiesReducer,
  session: sessionReducer,
  app: appReducer,
});
