import { call, takeEvery, put, select } from 'redux-saga/effects';
import {
  requestData as requestDataAction,
  fetchDataStart,
  fetchDataFail,
} from '~/state/actions/dataRequests';
import { getType, ActionType } from 'typesafe-actions';
import {
  RequestKeys,
  isGetCheckpointsBySymbolArgs,
  isGetDividendsByCheckpointArgs,
  isGetErc20DividendsModuleBySymbolArgs,
  isGetCheckpointBySymbolAndIdArgs,
  CacheStatus,
} from '~/types';
import {
  fetchCheckpointsBySymbol,
  fetchCheckpointBySymbolAndId,
} from './checkpoints';
import { fetchDividendsByCheckpoint } from './dividends';
import { fetchErc20DividendsModuleBySymbol } from '~/state/sagas/requests/modules';
import { createGetCacheStatus } from '~/state/selectors';
import { types } from '@polymathnetwork/new-shared';

function* runDataRequest(requestKey: RequestKeys, args: types.Pojo) {
  switch (requestKey) {
    case RequestKeys.GetCheckpointsBySymbol: {
      if (isGetCheckpointsBySymbolArgs(args)) {
        yield call(fetchCheckpointsBySymbol, args);
      } else {
        throw new Error('Invalid arguments passed for fetching checkpoints.');
      }
      break;
    }
    case RequestKeys.GetCheckpointBySymbolAndId: {
      if (isGetCheckpointBySymbolAndIdArgs(args)) {
        yield call(fetchCheckpointBySymbolAndId, args);
      } else {
        throw new Error('Invalid arguments passed for fetching checkpoint.');
      }
      break;
    }
    case RequestKeys.GetDividendsByCheckpoint: {
      if (isGetDividendsByCheckpointArgs(args)) {
        yield call(fetchDividendsByCheckpoint, args);
      } else {
        throw new Error('Invalid arguments passed for fetching dividends.');
      }
      break;
    }
    case RequestKeys.GetErc20DividendsModuleBySymbol: {
      if (isGetErc20DividendsModuleBySymbolArgs(args)) {
        yield call(fetchErc20DividendsModuleBySymbol, args);
      } else {
        throw new Error(
          'Invalid arguments passed for fetching dividends module.'
        );
      }
      break;
    }
    default:
      break;
  }
}

/**
 * This saga uses the cache to determine if data needs to be fetched from the blockchain
 * If it does, it calls the corresponding saga
 */
export function* requestData(action: ActionType<typeof requestDataAction>) {
  const {
    payload: {
      fetcher: { requestKey, args },
      fetcher,
    },
  } = action;

  const cacheStatus: CacheStatus[] = yield select(createGetCacheStatus(), {
    fetchers: [fetcher],
  });

  // Ignore request if it is already fetching or the data is present
  if (!cacheStatus[0].mustBeFetched) {
    return;
  }

  // set fetching to true for the corresponding cache entry
  yield put(
    fetchDataStart({
      requestKey,
      args,
    })
  );

  try {
    yield call(runDataRequest, requestKey, args);
  } catch (err) {
    fetchDataFail(err);
  }
}

export function* requestWatcher() {
  yield takeEvery(getType(requestDataAction), requestData);
}
