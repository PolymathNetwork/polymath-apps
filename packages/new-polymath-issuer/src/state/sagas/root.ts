import { all } from 'redux-saga/effects';

import { routerWatcher } from './router';

export function* rootSaga() {
  yield all([routerWatcher()]);
}
