import { polyClient } from '~/lib/polyClient';
import { call, put, take } from 'redux-saga/effects';
import { ActionType, getType } from 'typesafe-actions';
import { TransactionQueue, DividendModuleTypes } from '@polymathnetwork/sdk';
import {
  updateTaxWithholdingListStart,
  pushDividendPaymentStart,
  createErc20DividendDistributionStart,
  setDividendsWalletStart,
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
    symbol,
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
      symbol: symbol,
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

    // Queue was canceled, empty or failed
    if (queueStatus !== QueueStatus.Succeeded) {
      return;
    }

    // Invalidate cache
    yield put(
      invalidateRequest({
        requestKey: RequestKeys.GetDividendsByCheckpoint,
        args: {
          symbol,
          checkpointId,
        },
      })
    );

    yield put(
      invalidateRequest({
        requestKey: RequestKeys.GetCheckpointBySymbolAndId,
        args: {
          symbol,
          checkpointId,
        },
      })
    );

    yield put(
      push(
        `/securityTokens/${symbol}/checkpoints/${checkpointId}/dividends/${result}`
      )
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
          symbol,
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
    symbol,
    dividendType,
    investorAddresses,
    percentages,
  } = action.payload;
  const transactionQueueToRun: TransactionQueue = yield call(
    polyClient.updateDividendsTaxWithholdingList,
    {
      symbol: symbol,
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

    // Queue was canceled, empty or failed
    if (queueStatus !== QueueStatus.Succeeded) {
      return;
    }

    // Invalidate cache for all withholdings
    yield put(
      invalidateRequest({
        requestKey: RequestKeys.GetTaxWithholdingListBySymbolAndCheckpoint,
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
  const { symbol, dividendType, dividendIndex } = action.payload;
  const transactionQueueToRun: TransactionQueue = yield call(
    polyClient.pushDividendPayment,
    {
      symbol: symbol,
      dividendType,
      dividendIndex,
    }
  );

  try {
    const { queueStatus }: TransactionQueueResult = yield call(
      runTransactionQueue,
      transactionQueueToRun
    );

    // Queue was canceled
    // (if it failed we still invalidate cache because some of the payments could have been pushed successfully)
    if (queueStatus === QueueStatus.Canceled) {
      return;
    }

    if (queueStatus !== QueueStatus.Empty) {
      // Invalidate cache
      yield put(
        invalidateRequest({
          requestKey: RequestKeys.GetDividendBySymbolAndId,
          args: {
            symbol,
            dividendIndex,
            dividendType,
          },
        })
      );
    }
  } catch (err) {
    if (!err.code) {
      throw err;
    }
  }
}

export function* setDividendsWallet(
  action: ActionType<typeof setDividendsWalletStart>
) {
  const { symbol, dividendType, walletAddress } = action.payload;
  const transactionQueueToRun: TransactionQueue = yield call(
    polyClient.setDividendsWallet,
    {
      symbol: symbol,
      dividendType,
      address: walletAddress,
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
    // TODO @monitz87: delete default assignment when ETH dividends module request is implemented
    let requestKey: RequestKeys = RequestKeys.GetErc20DividendsModuleBySymbol;

    if (dividendType === DividendModuleTypes.Erc20) {
      requestKey = RequestKeys.GetErc20DividendsModuleBySymbol;
    }
    if (dividendType === DividendModuleTypes.Eth) {
      // TODO @monitz87: set request key to ETH dividends module request when it is implemented
    }

    yield put(
      invalidateRequest({
        requestKey,
        args: {
          symbol,
        },
      })
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
  const { symbol, dividendType, dividendIndex } = action.payload;
  const transactionQueueToRun: TransactionQueue = yield call(
    polyClient.withdrawTaxes,
    {
      symbol: symbol,
      dividendType,
      dividendIndex,
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
        requestKey: RequestKeys.GetDividendBySymbolAndId,
        args: {
          symbol,
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
