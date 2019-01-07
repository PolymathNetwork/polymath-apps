import { polyClient } from '~/lib/polymath';
import { cacheData, fetchDataFail } from '~/state/actions/dataRequests';
import { createAction as createCheckpoint } from '~/state/actions/checkpoints';
import { createAction as createDividend } from '~/state/actions/dividends';
import { call, put } from 'redux-saga/effects';
import { Checkpoint } from '@polymathnetwork/sdk';
import { RequestKeys } from '~/types';

export function* fetchCheckpointsBySymbol(args: {
  securityTokenSymbol: string;
}) {
  try {
    const { securityTokenSymbol } = args;
    const checkpoints: Checkpoint[] = yield call(polyClient.getCheckpoints, {
      symbol: securityTokenSymbol,
    });

    const fetchedCheckpointIds: string[] = [];

    const checkpointPojos = checkpoints.map(checkpoint => checkpoint.toPojo());
    for (const checkpoint of checkpointPojos) {
      const { dividends, ...rest } = checkpoint;

      fetchedCheckpointIds.push(checkpoint.uid);

      const fetchedDividendIds: string[] = [];

      for (const dividend of dividends) {
        fetchedDividendIds.push(dividend.uid);

        yield put(createDividend(dividend));
      }

      yield put(
        cacheData({
          requestKey: RequestKeys.GetDividendsByCheckpoint,
          args: { securityTokenSymbol, checkpointIndex: checkpoint.index },
          fetchedIds: fetchedDividendIds,
        })
      );

      yield put(createCheckpoint(rest));
    }

    yield put(
      cacheData({
        requestKey: RequestKeys.GetCheckpointsBySymbol,
        args,
        fetchedIds: fetchedCheckpointIds,
      })
    );
  } catch (err) {
    yield put(fetchDataFail(err));
  }
}
