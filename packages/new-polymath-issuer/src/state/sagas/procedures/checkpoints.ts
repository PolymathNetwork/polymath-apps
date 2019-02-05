import { polyClient } from '~/lib/polymath';
import { call, put } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { TransactionQueue } from '@polymathnetwork/sdk';
import { createCheckpointStart } from '~/state/actions/procedures';
import { runTransactionQueue } from '~/state/sagas/transactionQueues';
import { invalidateRequest } from '~/state/actions/dataRequests';
import { RequestKeys } from '~/types';

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
    const queueSucceeded: boolean = yield call(
      runTransactionQueue,
      transactionQueueToRun
    );

    // Queue was canceled or failed
    if (!queueSucceeded) {
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
