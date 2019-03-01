import { polyClient } from '~/lib/polyClient';
import { call, put, take } from 'redux-saga/effects';
import { ActionType, getType } from 'typesafe-actions';
import { TransactionQueue, DividendModuleTypes } from '@polymathnetwork/sdk';
import {
  updateTaxWithholdingListStart,
  pushDividendPaymentStart,
  createErc20DividendDistributionStart,
  withdrawDividendTaxesStart,
} from '~/state/actions/procedures';
import { runTransactionQueue } from '~/state/sagas/transactionQueues';
import { invalidateRequest } from '~/state/actions/dataRequests';
import { RequestKeys, TransactionQueueResult, QueueStatus } from '~/types';
import { finishTransactionQueue } from '~/state/actions/transactionQueues';
import { push } from 'redux-little-router';

export function* createErc20DividendsDistribution(
  action: ActionType<typeof createErc20DividendDistributionStart>
) {
  const {
    securityTokenSymbol,
    maturityDate,
    expiryDate,
    erc20Address,
    amount,
    checkpointId,
    name,
    excludedAddresses,
    pushPaymentsWhenComplete,
  } = action.payload;
  const transactionQueueToRun: TransactionQueue = yield call(
    polyClient.createErc20DividendDistribution,
    {
      symbol: securityTokenSymbol,
      maturityDate,
      expiryDate,
      erc20Address,
      amount,
      checkpointId,
      name,
      excludedAddresses,
    }
  );

  try {
    const { queueStatus, result }: TransactionQueueResult<number> = yield call(
      runTransactionQueue,
      transactionQueueToRun
    );

    // Queue was canceled or failed
    if (queueStatus !== QueueStatus.Succeeded) {
      return;
    }

    // Invalidate cache
    yield put(
      invalidateRequest({
        requestKey: RequestKeys.GetDividendsByCheckpoint,
        args: {
          securityTokenSymbol,
          checkpointIndex: checkpointId,
        },
      })
    );

    yield put(
      invalidateRequest({
        requestKey: RequestKeys.GetCheckpointBySymbolAndId,
        args: {
          securityTokenSymbol,
          checkpointIndex: checkpointId,
        },
      })
    );

    yield take(getType(finishTransactionQueue));

    if (pushPaymentsWhenComplete) {
      if (result === undefined) {
        throw new Error(
          'Something went wrong. A dividend distribution was created but no dividend index was returned from the SDK.'
        );
      }
      yield put(
        pushDividendPaymentStart({
          securityTokenSymbol,
          dividendType: DividendModuleTypes.Erc20,
          dividendIndex: result,
        })
      );
    }
  } catch (err) {
    if (!err.code) {
      throw err;
    }
  }
}

export function* updateTaxWithholdingList(
  action: ActionType<typeof updateTaxWithholdingListStart>
) {
  const {
    securityTokenSymbol,
    dividendType,
    investorAddresses,
    percentages,
  } = action.payload;
  const transactionQueueToRun: TransactionQueue = yield call(
    polyClient.setDividendsTaxWithholdingList,
    {
      symbol: securityTokenSymbol,
      dividendType,
      investorAddresses,
      percentages,
    }
  );

  try {
    const { queueStatus }: TransactionQueueResult = yield call(
      runTransactionQueue,
      transactionQueueToRun
    );

    // Queue was canceled or failed
    if (queueStatus !== QueueStatus.Succeeded) {
      return;
    }

    // Invalidate cache
    yield put(
      invalidateRequest({
        requestKey: RequestKeys.GetTaxWithholdingListBySymbol,
        args: {
          securityTokenSymbol,
          dividendType,
        },
      })
    );
  } catch (err) {
    if (!err.code) {
      throw err;
    }
  }
}

export function* pushDividendPayment(
  action: ActionType<typeof pushDividendPaymentStart>
) {
  const { securityTokenSymbol, dividendType, dividendIndex } = action.payload;
  const transactionQueueToRun: TransactionQueue = yield call(
    polyClient.pushDividendPayment,
    {
      symbol: securityTokenSymbol,
      dividendType,
      dividendId: dividendIndex,
    }
  );

  try {
    const { queueStatus }: TransactionQueueResult = yield call(
      runTransactionQueue,
      transactionQueueToRun
    );

    // Queue was canceled
    // (if it failed we still redirect and invalidate cache because some of the payments could have been pushed successfully)
    if (queueStatus === QueueStatus.Canceled) {
      return;
    }

    // Invalidate cache
    yield put(
      invalidateRequest({
        requestKey: RequestKeys.GetDividendBySymbolAndId,
        args: {
          securityTokenSymbol,
          dividendIndex,
          dividendType,
        },
      })
    );

    yield take(getType(finishTransactionQueue));

    yield put(
      push(`/securityTokens/${securityTokenSymbol}/dividends/${dividendIndex}`)
    );
  } catch (err) {
    if (!err.code) {
      throw err;
    }
  }
}

export function* withdrawDividendTaxes(
  action: ActionType<typeof withdrawDividendTaxesStart>
) {
  const { securityTokenSymbol, dividendType, dividendIndex } = action.payload;
  const transactionQueueToRun: TransactionQueue = yield call(
    polyClient.withdrawTaxes,
    {
      symbol: securityTokenSymbol,
      dividendType,
      dividendIndex,
    }
  );

  try {
    const { queueStatus }: TransactionQueueResult = yield call(
      runTransactionQueue,
      transactionQueueToRun
    );

    // Queue was canceled or failed
    if (queueStatus !== QueueStatus.Succeeded) {
      return;
    }

    // Invalidate cache
    yield put(
      invalidateRequest({
        requestKey: RequestKeys.GetDividendBySymbolAndId,
        args: {
          securityTokenSymbol,
          dividendIndex,
          dividendType,
        },
      })
    );
  } catch (err) {
    if (!err.code) {
      throw err;
    }
  }
}
