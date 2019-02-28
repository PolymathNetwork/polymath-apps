import { call, put, take, race, all } from 'redux-saga/effects';
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
import { eventChannel } from 'redux-saga';
import { types } from '@polymathnetwork/new-shared';
import { QueueStatus } from '~/types';

/**
 * Populates the state with the current transactions in the queue and the queue itself,
 * waits for confirmation (or cancellation) and runs the queue
 *
 * @returns an object containing the status of the queue (if it was canceled, failed or succeeded), and the return value of the queue
 */
export function* runTransactionQueue<Args, ReturnType>(
  transactionQueueToRun: TransactionQueue<Args, ReturnType>
) {
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
    return QueueStatus.Canceled;
  }

  /**
   * Start running the queue and watch for status changes
   *
   * NOTE @monitz87: the order in which the calls occur in the array is important,
   * since we need to start listening to status changes BEFORE the queue starts to run,
   * or we cannot catch the change from 'IDLE' to 'RUNNING'
   */
  let queueStatus: QueueStatus;
  let result: ReturnType;
  [queueStatus, result] = yield all([
    call(watchQueueStatus, transactionQueueToRun),
    call(transactionQueueToRun.run),
  ]);

  return {
    queueStatus,
    result,
  };
}

/**
 * Watches for status changes in a queue and updates the state accordingly
 *
 * @returns true if the queue succeeded, false if it failed
 */
export function* watchQueueStatus(transactionQueue: TransactionQueue) {
  // Channel that emits the queue every time its status changes
  const statusChangeChannel = eventChannel<TransactionQueue>(emit => {
    return transactionQueue.onStatusChange(changedQueue => {
      emit(changedQueue);
    });
  });

  while (true) {
    const changedQueue: TransactionQueue = yield take(statusChangeChannel);

    const { transactions, ...rest } = changedQueue.toPojo();

    yield put(updateTransactionQueue(rest));

    const { status } = rest;
    const failed = status === types.TransactionQueueStatus.Failed;
    const succeeded = status === types.TransactionQueueStatus.Succeeded;

    if (failed || succeeded) {
      statusChangeChannel.close();

      if (failed) {
        return QueueStatus.Failed;
      }

      return QueueStatus.Succeeded;
    }
  }
}
