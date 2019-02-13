import { polyClient } from '~/lib/polyClient';
import { call, put } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { TransactionQueue } from '@polymathnetwork/sdk';
import {
  updateTaxWithholdingListStart,
  pushDividendPaymentStart,
} from '~/state/actions/procedures';
import { runTransactionQueue } from '~/state/sagas/transactionQueues';
import { invalidateRequest } from '~/state/actions/dataRequests';
import { RequestKeys } from '~/types';

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
        requestKey: RequestKeys.GetTaxWithholdingListBySymbol,
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
