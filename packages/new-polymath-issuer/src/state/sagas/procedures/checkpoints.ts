import { polyClient } from '~/lib/polyClient';
import { call, put } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { TransactionQueue, DividendModuleTypes } from '@polymathnetwork/sdk';
import { createCheckpointStart } from '~/state/actions/procedures';
import { runTransactionQueue } from '~/state/sagas/transactionQueues';
import { invalidateRequest } from '~/state/actions/dataRequests';
import { RequestKeys, TransactionQueueResult, QueueStatus } from '~/types';

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
    const { queueStatus }: TransactionQueueResult = yield call(
      runTransactionQueue,
      transactionQueueToRun
    );

    // Queue was canceled, empty or failed
    if (queueStatus !== QueueStatus.Succeeded) {
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

    // TODO @monitz87: move these tax withholding cache invalidations to the minting procedure
    // saga when it is implemented
    yield put(
      invalidateRequest({
        requestKey: RequestKeys.GetTaxWithholdingListBySymbolAndCheckpoint,
        args: {
          securityTokenSymbol,
          dividendType: DividendModuleTypes.Erc20,
        },
      })
    );

    yield put(
      invalidateRequest({
        requestKey: RequestKeys.GetTaxWithholdingListBySymbolAndCheckpoint,
        args: {
          securityTokenSymbol,
          dividendType: DividendModuleTypes.Eth,
        },
      })
    );
  } catch (err) {
    if (!err.code) {
      throw err;
    }
  }
}
