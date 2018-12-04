import { ActionType } from 'typesafe-actions';
import * as sessionActions from './session';
import * as appActions from './app';
import * as networkActions from './network';

export type SessionActions = ActionType<typeof sessionActions>;
export type AppActions = ActionType<typeof appActions>;
export type NetworkActions = ActionType<typeof networkActions>;
