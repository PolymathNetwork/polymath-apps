import { polyClient } from '~/lib/polymath';
import { cacheData, fetchDataFail } from '~/state/actions/dataRequests';
import { createAction as createCheckpoint } from '~/state/actions/checkpoints';
import { createAction as createDividend } from '~/state/actions/dividends';
import { call, put } from 'redux-saga/effects';
import { Checkpoint } from '@polymathnetwork/sdk';
import { RequestKeys } from '~/types';
import { types } from '@polymathnetwork/new-shared';

/**
 * Creates an entity in the state representing the checkpoint and the corresponding cache
 * entries for all associated requests
 *
 * @param checkpoint POJO representing a checkpoint
 */
export function* saveCheckpoint(checkpoint: types.CheckpointPojo) {
  const { dividends, ...rest } = checkpoint;
  const { securityTokenSymbol, uid, index } = checkpoint;

  const fetchedDividendIds: string[] = [];

  for (const dividend of dividends) {
    fetchedDividendIds.push(dividend.uid);

    yield put(createDividend(dividend));
  }

  // cross-cache the dividends
  yield put(
    cacheData({
      requestKey: RequestKeys.GetDividendsByCheckpoint,
      args: { securityTokenSymbol, checkpointIndex: index },
      fetchedIds: fetchedDividendIds,
    })
  );

  // cross-cache the individual checkpoint
  yield put(
    cacheData({
      requestKey: RequestKeys.GetCheckpointBySymbolAndId,
      args: { securityTokenSymbol, checkpointIndex: index },
      fetchedIds: [uid],
    })
  );

  yield put(createCheckpoint(rest));
}

/**
 * Fetches a particular checkpoint for a security token
 * from the cache or the blockchain
 *
 * @param args request arguments
 */
export function* fetchCheckpointBySymbolAndId(args: {
  securityTokenSymbol: string;
  checkpointIndex: number;
}) {
  try {
    const { securityTokenSymbol, checkpointIndex } = args;
    const checkpoint: Checkpoint | null = yield call(polyClient.getCheckpoint, {
      symbol: securityTokenSymbol,
      checkpointIndex,
    });

    const fetchedCheckpointIds: string[] = [];

    if (checkpoint) {
      const checkpointPojo = checkpoint.toPojo();
      fetchedCheckpointIds.push(checkpoint.uid);

      yield call(saveCheckpoint, checkpointPojo);
    }

    yield put(
      cacheData({
        requestKey: RequestKeys.GetCheckpointBySymbolAndId,
        args,
        fetchedIds: fetchedCheckpointIds,
      })
    );
  } catch (err) {
    yield put(fetchDataFail(err));
  }
}

/**
 * Fetches a all checkpoints for a security token
 * from the cache or the blockchain
 *
 * @param args request arguments
 */
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
      fetchedCheckpointIds.push(checkpoint.uid);

      yield call(saveCheckpoint, checkpoint);
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
