import { polyClient } from '~/lib/polyClient';
import { call, put } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { TransactionQueue } from '@polymathnetwork/sdk';
import { createCheckpointStart } from '~/state/actions/procedures';
import { runTransactionQueue } from '~/state/sagas/transactionQueues';
import { invalidateRequest } from '~/state/actions/dataRequests';
import { RequestKeys, TransactionQueueResult } from '~/types';

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
    const { success }: TransactionQueueResult = yield call(
      runTransactionQueue,
      transactionQueueToRun
    );

    // Queue was canceled or failed
    if (!success) {
      return;
    }

    // Invalidate cache
    yield put(
      invalidateRequest({
        requestKey: RequestKeys.GetCheckpointsBySymbol,
        args: {
          securityTokenSymbol,
        },
      })
    );
  } catch (err) {
    if (!err.code) {
      throw err;
    }
  }
}
