import { call, put, take, race, all, fork } from 'redux-saga/effects';
import { TransactionQueue } from '@polymathnetwork/sdk';
import { setActiveTransactionQueue } from '~/state/actions/app';
import { getType, ActionType } from 'typesafe-actions';
import {
  confirmTransactionQueue,
  updateAction as updateTransactionQueue,
  createAction as createTransactionQueue,
  cancelTransactionQueue,
} from '~/state/actions/transactionQueues';
import { createAction as createTransaction } from '~/state/actions/transactions';
import { eventChannel } from 'redux-saga';
import { types } from '@polymathnetwork/new-shared';
import { QueueStatus, TransactionQueueResult } from '~/types';
import { watchTransaction } from '~/state/sagas/transactions';

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

  // if the queue is empty we abort
  if (!transactions.length) {
    return {
      queueStatus: QueueStatus.Empty,
    };
  }

  const transactionsToRun = transactionQueueToRun.transactions;

  const { uid } = transactionQueue;

  const transactionEntities: types.TransactionEntity[] = transactionsToRun.map(
    transaction => transaction.toPojo()
  );

  for (const transaction of transactionEntities) {
    yield put(createTransaction(transaction));
  }

  yield put(createTransactionQueue(transactionQueue));
  yield put(setActiveTransactionQueue(uid));

  // Wait until the confirmation modal is either confirmed or closed
  const {
    canceled,
  }: {
    canceled: ActionType<typeof cancelTransactionQueue>;
  } = yield race({
    canceled: take(getType(cancelTransactionQueue)),
    confirmed: take(getType(confirmTransactionQueue)),
  });

  // Stop the saga and return false if the transactions weren't confirmed
  if (canceled) {
    return {
      queueStatus: QueueStatus.Canceled,
    };
  }

  for (const transaction of transactionsToRun) {
    yield fork(watchTransaction, transaction);
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
