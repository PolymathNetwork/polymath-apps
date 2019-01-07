import { call, takeLatest } from 'redux-saga/effects';
import { fetchData } from '~/state/actions/dataRequests';
import { getType, ActionType } from 'typesafe-actions';
import {
  RequestKeys,
  isGetCheckpointsBySymbolArgs,
  isGetDividendsByCheckpointArgs,
} from '~/types';
import { fetchCheckpoints } from './checkpoints';
import { fetchDividends } from './dividends';

export function* requestData(action: ActionType<typeof fetchData>) {
  const {
    payload: { requestKey, args },
  } = action;

  switch (requestKey) {
    case RequestKeys.GetCheckpointsBySymbol: {
      if (isGetCheckpointsBySymbolArgs(args)) {
        yield call(fetchCheckpoints, args);
      } else {
        throw new Error('Invalid arguments passed for fetching checkpoints.');
      }
    }
    case RequestKeys.GetDividendsByCheckpoint: {
      if (isGetDividendsByCheckpointArgs(args)) {
        yield call(fetchDividends, args);
      } else {
        throw new Error('Invalid arguments passed for fetching dividends.');
      }
    }
    default:
      return;
  }
}

export function* requestWatcher() {
  yield takeLatest(getType(fetchData), requestData);
}
