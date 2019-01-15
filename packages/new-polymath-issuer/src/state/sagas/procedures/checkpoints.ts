import { polyClient } from '~/lib/polymath';
import { call } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { TransactionQueue } from '@polymathnetwork/sdk';
import { createCheckpointStart } from '~/state/actions/procedures';
import { runTransactionQueue } from '~/state/sagas/transactionQueues';

export function* createCheckpoint(
  action: ActionType<typeof createCheckpointStart>
) {
  const { securityTokenSymbol } = action.payload;
  const transactionQueueToRun: TransactionQueue = yield call(
    polyClient.createCheckpoint,
    {
      symbol: securityTokenSymbol,
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
