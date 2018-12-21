import { checkpointsWatcher } from './checkpoints';
import { all } from 'redux-saga/effects';

export function* requestWatcher() {
  yield all([checkpointsWatcher()]);
}
