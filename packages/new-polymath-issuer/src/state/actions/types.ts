import { ActionType } from 'typesafe-actions';
import * as sessionActions from './session';
import * as appActions from './app';

export type SessionActions = ActionType<typeof sessionActions>;
export type AppActions = ActionType<typeof appActions>;
