import { call, put, take } from 'redux-saga/effects';
import { TransactionQueue } from '@polymathnetwork/sdk';
import { setActiveSequence } from '~/state/actions/app';
import { newTransaction } from '~/state/actions/transactions';
import { getType } from 'typesafe-actions';
import {
  confirmSequence,
  updateAction as updateTransactionQueue,
  createAction as createTransactionQueue,
} from '~/state/actions/transactionQueues';

export function* runSequence(transactionQueueToRun: TransactionQueue) {
  const { transactions, ...transactionQueue } = transactionQueueToRun.toPojo();

  const transactionsToRun = transactionQueueToRun.transactions;
  for (const transaction of transactionsToRun) {
    yield put(newTransaction(transaction));
  }

  const { uid } = transactionQueue;

  yield put(createTransactionQueue(transactionQueue));
  yield put(setActiveSequence(uid));

  yield take(getType(confirmSequence));

  yield call(transactionQueueToRun.run);

  const { status } = transactionQueueToRun;

  yield put(updateTransactionQueue({ uid, status }));
}
