import { all } from 'redux-saga/effects';

import { routerWatcher } from './router';
import { walletWatcher } from './wallet';
import { sessionWatcher } from './session';
import { requestWatcher } from './requests';
import { procedureWatcher } from './procedures';

export function* rootSaga() {
  yield all([
    routerWatcher(),
    walletWatcher(),
    sessionWatcher(),
    requestWatcher(),
    procedureWatcher(),
  ]);
}
