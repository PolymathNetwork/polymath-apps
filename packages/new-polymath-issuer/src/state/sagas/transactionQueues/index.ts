import { call, put, take, race } from 'redux-saga/effects';
import { TransactionQueue } from '@polymathnetwork/sdk';
import { setActiveTransactionQueue } from '~/state/actions/app';
import { newTransaction } from '~/state/actions/transactions';
import { getType, ActionType } from 'typesafe-actions';
import {
  confirmTransactionQueue,
  updateAction as updateTransactionQueue,
  createAction as createTransactionQueue,
  cancelTransactionQueue,
} from '~/state/actions/transactionQueues';

/**
 * Populates the state with the current transactions in the queue and the queue itself,
 * waits for confirmation (or cancellation) and runs the queue
 *
 * @returns true if the queue was run, false if it was canceled
 */
export function* runTransactionQueue(transactionQueueToRun: TransactionQueue) {
  const { transactions, ...transactionQueue } = transactionQueueToRun.toPojo();

  const transactionsToRun = transactionQueueToRun.transactions;

  for (const transaction of transactionsToRun) {
    yield put(newTransaction(transaction));
  }

  const { uid } = transactionQueue;

  yield put(createTransactionQueue(transactionQueue));
  yield put(setActiveTransactionQueue(uid));

  // Wait until the confirmation modal is either confirmed or closed
  const {
    canceled,
  }: {
    canceled: ActionType<typeof cancelTransactionQueue>;
  } = yield race({
    confirmed: take(getType(confirmTransactionQueue)),
    canceled: take(getType(cancelTransactionQueue)),
  });

  // Stop the saga and return false if the transactions weren't confirmed
  if (canceled) {
    return false;
  }

  yield call(transactionQueueToRun.run);

  const { status } = transactionQueueToRun;

  yield put(updateTransactionQueue({ uid, status }));

  return true;
}
