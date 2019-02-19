import { call, put } from 'redux-saga/effects';
import { browserUtils } from '@polymathnetwork/sdk';
import {
  initializePolyClientStart,
  initializePolyClientFailure,
  initializePolyClientSuccess,
} from '~/state/actions/app';
import { polyClient } from '~/lib/polyClient';
import { NETWORK } from '~/constants';
import { requireWallet } from './accessControl';

export function* initializePolyClient() {
  yield put(initializePolyClientStart());
  yield requireWallet();
  try {
    const networkId = (yield call(browserUtils.getNetworkId)) as number | null;
    if (!networkId) {
      throw new Error('Network ID could not be optioned');
    }
    yield call(polyClient.connect, NETWORK.POLY_CLIENT_PARAMS[networkId]);
    yield put(initializePolyClientSuccess());
  } catch (error) {
    yield put(initializePolyClientFailure(error.message));
    throw error;
  }
}
