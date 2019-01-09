import { call, put, take } from 'redux-saga/effects';
import { Sequence as PolymathSequence } from '@polymathnetwork/sdk/build/dist/entities/Sequence';
import { setActiveSequence } from '~/state/actions/app';
import { SequenceEntity } from '~/types';
import { PolyTransaction } from '@polymathnetwork/sdk/build/dist/entities/PolyTransaction';
import { newTransaction } from '~/state/actions/transactions';
import { getType } from 'typesafe-actions';
import { confirmSequence, updateAction } from '~/state/actions/sequences';

export function* runSequence(sequenceToRun: PolymathSequence) {
  // TODO @monitz87: transform sequence into plain object with toPojo
  const sequence: SequenceEntity = {
    uid: '1',
  };

  // TODO @monitz87: get real transactions from sequence
  const transactions: Array<PolyTransaction<any>> = [];

  for (const transaction of transactions) {
    yield put(newTransaction(transaction));
  }

  yield put(setActiveSequence(sequence.uid));

  yield take(getType(confirmSequence));

  yield call(sequenceToRun.run);

  // TODO @monitz87: add status variable to update
  yield put(updateAction({ uid: sequence.uid }));
}
