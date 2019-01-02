import { polyClient } from '~/lib/polymath';
import {
  fetchCheckpoints as fetch,
  fetchCheckpointsSuccess,
  fetchCheckpointsError,
} from '~/state/actions/checkpoints';
import { takeLatest } from 'redux-saga';
import { getType, ActionType } from 'typesafe-actions';
import { call, put } from 'redux-saga/effects';
import { Checkpoint } from '@polymathnetwork/sdk';
import BigNumber from 'bignumber.js';

export function* fetchCheckpoints(action: ActionType<typeof fetch>) {
  const symbol = action.payload;

  try {
    const checkpoints: Checkpoint[] = yield call(polyClient.getCheckpoints, {
      symbol,
    });
    // const checkpoints: Checkpoint[] = [
    //   {
    //     id: 1,
    //     dividends: [],
    //     totalSupply: new BigNumber('2000'),
    //     createdAt: new Date(),
    //     investorBalances: [
    //       {
    //         address: '0x1',
    //         balance: new BigNumber('1000'),
    //       },
    //     ],
    //   },
    // ];
    yield put(fetchCheckpointsSuccess(checkpoints));
  } catch (err) {
    yield put(fetchCheckpointsError(err));
  }
}

export function* checkpointsWatcher() {
  yield takeLatest(getType(fetch), fetchCheckpoints);
}
