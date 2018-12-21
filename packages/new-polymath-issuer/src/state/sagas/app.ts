import { call, put } from 'redux-saga/effects';
import {
  initializePolyClientStart,
  initializePolyClientFailure,
  initializePolyClientSuccess,
} from '~/state/actions/app';
import { polyClient } from '~/lib/polyClient';
import { requireWallet } from './accessControl';

export function* initializePolyClient() {
  yield put(initializePolyClientStart());
  yield requireWallet();
  try {
    yield call(polyClient.connect.bind(polyClient));
    yield put(initializePolyClientSuccess());
  } catch (error) {
    yield put(initializePolyClientFailure(error.message));
    throw error;
  }
}
