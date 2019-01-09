import { put } from 'redux-saga/effects';
import { createAction, newTransaction } from '~/state/actions/transactions';
import { TransactionEntity } from '~/types';
import { takeEvery } from 'redux-saga';
import { getType, ActionType } from 'typesafe-actions';

export function* watchTransaction({
  payload: transaction,
}: ActionType<typeof newTransaction>) {
  // TODO @monitz87: transform transaction into plain object with toPojo
  const transactionEntity: TransactionEntity = {} as TransactionEntity;

  yield put(createAction(transactionEntity));

  // TODO @monitz87: set listeners on the transaction to dispatch the different actions
  // to the store
}

export function* transactionWatcher() {
  return takeEvery(getType(newTransaction), watchTransaction);
}
