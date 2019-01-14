import { call, put, take } from 'redux-saga/effects';
import { TransactionQueue } from '@polymathnetwork/sdk';
import { setActiveTransactionQueue } from '~/state/actions/app';
import { newTransaction } from '~/state/actions/transactions';
import { getType } from 'typesafe-actions';
import {
  confirmTransactionQueue,
  updateAction as updateTransactionQueue,
  createAction as createTransactionQueue,
} from '~/state/actions/transactionQueues';

export function* runTransactionQueue(transactionQueueToRun: TransactionQueue) {
  const { transactions, ...transactionQueue } = transactionQueueToRun.toPojo();

  const transactionsToRun = transactionQueueToRun.transactions;

  for (const transaction of transactionsToRun) {
    yield put(newTransaction(transaction));
  }

  const { uid } = transactionQueue;

  yield put(createTransactionQueue(transactionQueue));
  yield put(setActiveTransactionQueue(uid));

  // NOTE @monitz87: uncomment after demo
  yield take(getType(confirmTransactionQueue));

  yield call(transactionQueueToRun.run);

  const { status } = transactionQueueToRun;

  yield put(updateTransactionQueue({ uid, status }));
}
