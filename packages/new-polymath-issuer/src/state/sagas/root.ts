import { all } from 'redux-saga/effects';

import { routerWatcher } from './router';
import { walletWatcher } from './wallet';

export function* rootSaga() {
  yield all([routerWatcher(), walletWatcher()]);
}
