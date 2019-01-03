import { polyClient } from '~/lib/polymath';
import { cacheData, fetchDataFail } from '~/state/actions/dataRequests';
import { createAction as createCheckpoint } from '~/state/actions/checkpoints';
import { createAction as createDividend } from '~/state/actions/dividends';
import { takeLatest } from 'redux-saga';
import { getType, ActionType } from 'typesafe-actions';
import { call, put } from 'redux-saga/effects';
import { Checkpoint } from '@polymathnetwork/sdk';
import BigNumber from 'bignumber.js';
import { RequestKeys } from '~/types';

export function* fetchCheckpoints(args: { symbol: string }) {
  try {
    const { symbol } = args;
    // const checkpoints: Checkpoint[] = yield call(polyClient.getCheckpoints, {
    //   symbol,
    // });
    const checkpoints: Checkpoint[] = [
      new Checkpoint({
        id: 1,
        securityTokenSymbol: symbol,
        dividends: [],
        totalSupply: new BigNumber('2000'),
        createdAt: new Date(),
        investorBalances: [
          {
            address: '0x1',
            balance: new BigNumber('1000'),
          },
        ],
      }),
    ];

    // yield put(cacheData({
    //   requestKey: RequestKeys.GetCheckpointsBySymbol,
    //   args,
    //   fetchedIds: ['1']
    // }));
  } catch (err) {
    yield put(fetchDataFail(err));
  }
}
