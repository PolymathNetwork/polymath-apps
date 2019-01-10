import { put, take } from 'redux-saga/effects';
import {
  createAction,
  updateAction,
  newTransaction,
} from '~/state/actions/transactions';
import { types } from '@polymathnetwork/new-shared';
import { takeEvery, eventChannel, END } from 'redux-saga';
import { getType, ActionType } from 'typesafe-actions';
import { PolyTransaction } from '@polymathnetwork/sdk';
import { TransactionStatus } from '@polymathnetwork/new-shared/build/dist/typing/types';

export function* watchTransaction({
  payload: transaction,
}: ActionType<typeof newTransaction>) {
  const transactionEntity: types.TransactionEntity = transaction.toPojo();

  yield put(createAction(transactionEntity));

  /**
   * Channel that emits a transaction every time its status changes
   */
  const statusChangeChannel = eventChannel<PolyTransaction>(emit => {
    return transaction.onStatusChange(changedTransaction => {
      emit(changedTransaction);
    });
  });

  while (true) {
    const changedTransaction: PolyTransaction = yield take(statusChangeChannel);

    yield put(updateAction(changedTransaction.toPojo()));

    const transactionIsFinished = [
      TransactionStatus.Failed,
      TransactionStatus.Rejected,
      TransactionStatus.Succeeded,
    ].find(status => status === changedTransaction.status);

    if (transactionIsFinished) {
      statusChangeChannel.close();
      return;
    }
  }
}

export function* transactionWatcher() {
  return takeEvery(getType(newTransaction), watchTransaction);
}
