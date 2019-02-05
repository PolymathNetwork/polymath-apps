import { ActionType } from 'typesafe-actions';
import * as sessionActions from './session';
import * as appActions from './app';
import * as dataRequestsActions from './dataRequests';

export type SessionActions = ActionType<typeof sessionActions>;
export type AppActions = ActionType<typeof appActions>;
export type DataRequestsActions = ActionType<typeof dataRequestsActions>;
