import { polyClient } from '~/lib/polymath';
import { call } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { DividendModuleTypes } from '@polymathnetwork/sdk';
import { TransactionQueue } from '@polymathnetwork/sdk';
import { enableErc20DividendsModuleStart } from '~/state/actions/procedures';
import { runTransactionQueue } from '~/state/sagas/transactionQueues';

export function* enableErc20DividendsModule(
  action: ActionType<typeof enableErc20DividendsModuleStart>
) {
  const { securityTokenSymbol } = action.payload;
  const transactionQueueToRun: TransactionQueue = yield call(
    polyClient.enableDividendModules,
    {
      symbol: securityTokenSymbol,
      types: [DividendModuleTypes.Erc20],
    }
  );

  try {
    yield call(runTransactionQueue, transactionQueueToRun);
  } catch (err) {
    if (!err.code) {
      throw err;
    }
  }
}
