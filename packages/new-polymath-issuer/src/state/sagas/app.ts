import { call, put } from 'redux-saga/effects';
import {
  initializePolyClientStart,
  initializePolyClientFailure,
  initializePolyClientSuccess,
} from '~/state/actions/app';
import { polyClient } from '~/lib/polymath';
import { requireWallet } from './accessControl';

export function* initializePolyClient() {
  yield put(initializePolyClientStart());
  yield requireWallet();
  try {
    yield call(polyClient.connect);
    yield put(initializePolyClientSuccess());
  } catch (error) {
    yield put(initializePolyClientFailure(error.message));
    throw error;
  }
}
