import { put, take, takeEvery } from 'redux-saga/effects';
import {
  createAction,
  updateAction,
} from '~/state/actions/transactions';
import { eventChannel } from 'redux-saga';
import { types } from '@polymathnetwork/new-shared';
import { PolyTransaction } from '@polymathnetwork/sdk';

export function* watchTransaction(
  transaction: PolyTransaction) {
  const transactionEntity: types.TransactionEntity = {
    ...transaction.toPojo(),
  };

  yield put(createAction(transactionEntity));

  // Channel that emits a transaction every time its status changes
  const statusChangeChannel = eventChannel<PolyTransaction>(emit => {
    return transaction.onStatusChange(changedTransaction => {
      emit(changedTransaction);
    });
  });

  while (true) {
    const changedTransaction: PolyTransaction = yield take(statusChangeChannel);

    yield put(updateAction(changedTransaction.toPojo()));

    const transactionIsFinished = [
      types.TransactionStatus.Failed,
      types.TransactionStatus.Rejected,
      types.TransactionStatus.Succeeded,
    ].find(status => status === changedTransaction.status);

    if (transactionIsFinished) {
      statusChangeChannel.close();
      return;
    }
  }
}
