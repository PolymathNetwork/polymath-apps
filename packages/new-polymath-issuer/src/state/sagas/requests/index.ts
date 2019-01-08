import { call, takeEvery, all } from 'redux-saga/effects';
import { fetchData } from '~/state/actions/dataRequests';
import { getType, ActionType } from 'typesafe-actions';
import {
  RequestKeys,
  isGetCheckpointsBySymbolArgs,
  isGetDividendsByCheckpointArgs,
  isGetErc20DividendsModuleBySymbolArgs,
} from '~/types';
import { fetchCheckpointsBySymbol } from './checkpoints';
import { fetchDividendsByCheckpoint } from './dividends';
import { fetchErc20DividendsModuleBySymbol } from '~/state/sagas/requests/modules';

export function* requestData(action: ActionType<typeof fetchData>) {
  const {
    payload: { requestKey, args },
  } = action;

  switch (requestKey) {
    case RequestKeys.GetCheckpointsBySymbol: {
      if (isGetCheckpointsBySymbolArgs(args)) {
        yield call(fetchCheckpointsBySymbol, args);
      } else {
        throw new Error('Invalid arguments passed for fetching checkpoints.');
      }
    }
    case RequestKeys.GetDividendsByCheckpoint: {
      if (isGetDividendsByCheckpointArgs(args)) {
        yield call(fetchDividendsByCheckpoint, args);
      } else {
        throw new Error('Invalid arguments passed for fetching dividends.');
      }
    }
    case RequestKeys.GetErc20DividendsModuleBySymbol: {
      if (isGetErc20DividendsModuleBySymbolArgs(args)) {
        yield call(fetchErc20DividendsModuleBySymbol, args);
      } else {
        throw new Error(
          'Invalid arguments passed for fetching dividends module.'
        );
      }
    }
    default:
      return;
  }
}

export function* requestWatcher() {
  yield takeEvery(getType(fetchData), requestData);
}
