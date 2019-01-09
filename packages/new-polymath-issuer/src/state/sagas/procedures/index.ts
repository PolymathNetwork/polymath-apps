import { takeLatest, all } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import { enableErc20DividendsModule } from './modules';
import { enableErc20DividendsModuleStart } from '~/state/actions/procedures';

export function* procedureWatcher() {
  yield all([
    takeLatest(
      getType(enableErc20DividendsModuleStart),
      enableErc20DividendsModule
    ),
  ]);
}
