import { call, takeLatest } from 'redux-saga/effects';
import { fetchData } from '~/state/actions/dataRequests';
import { getType, ActionType } from 'typesafe-actions';
import { RequestKeys } from '~/types';
import { fetchCheckpoints } from '~/state/sagas/requests/checkpoints';

export function* requestData(action: ActionType<typeof fetchData>) {
  const {
    payload: { requestKey, args },
  } = action;

  switch (requestKey) {
    case RequestKeys.GetCheckpointsBySymbol: {
      if (typeof args.symbol === 'string') {
        yield call(fetchCheckpoints, args as { symbol: string });
      } else {
        throw new Error(
          'Invalid arguments passed for fetching checkpoints. Missing token symbol.'
        );
      }
    }
    default:
      return;
  }
}

export function* requestWatcher() {
  yield takeLatest(getType(fetchData), requestData);
}
