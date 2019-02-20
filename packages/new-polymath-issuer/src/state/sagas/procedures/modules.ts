import { polyClient } from '~/lib/polyClient';
import { call, put } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { DividendModuleTypes } from '@polymathnetwork/sdk';
import { TransactionQueue } from '@polymathnetwork/sdk';
import { enableErc20DividendsModuleStart } from '~/state/actions/procedures';
import { runTransactionQueue } from '~/state/sagas/transactionQueues';
import { invalidateRequest } from '~/state/actions/dataRequests';
import { RequestKeys, TransactionQueueResult } from '~/types';

export function* enableErc20DividendsModule(
  action: ActionType<typeof enableErc20DividendsModuleStart>
) {
  const { securityTokenSymbol, storageWalletAddress } = action.payload;
  const transactionQueueToRun: TransactionQueue = yield call(
    polyClient.enableDividendModules,
    {
      symbol: securityTokenSymbol,
      storageWalletAddress,
      types: [DividendModuleTypes.Erc20],
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
        requestKey: RequestKeys.GetErc20DividendsModuleBySymbol,
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
