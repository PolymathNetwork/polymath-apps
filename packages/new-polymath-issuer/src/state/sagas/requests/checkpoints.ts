import { polyClient } from '~/lib/polymath';
import { cacheData, fetchDataFail } from '~/state/actions/dataRequests';
import { createAction as createCheckpoint } from '~/state/actions/checkpoints';
import { createAction as createDividend } from '~/state/actions/dividends';
import { call, put } from 'redux-saga/effects';
import { Checkpoint } from '@polymathnetwork/sdk';
import { RequestKeys } from '~/types';

export function* fetchCheckpoints(args: { symbol: string }) {
  try {
    const { symbol } = args;
    const checkpoints: Checkpoint[] = yield call(polyClient.getCheckpoints, {
      symbol,
    });

    const fetchedIds: string[] = [];

    const checkpointPojos = checkpoints.map(checkpoint => checkpoint.toPojo());
    for (const checkpoint of checkpointPojos) {
      const { dividends, ...rest } = checkpoint;

      fetchedIds.push(checkpoint.uid);

      for (const dividend of dividends) {
        yield put(createDividend(dividend));
      }

      yield put(createCheckpoint(rest));
    }

    yield put(
      cacheData({
        requestKey: RequestKeys.GetCheckpointsBySymbol,
        args,
        fetchedIds,
      })
    );
  } catch (err) {
    yield put(fetchDataFail(err));
  }
}
