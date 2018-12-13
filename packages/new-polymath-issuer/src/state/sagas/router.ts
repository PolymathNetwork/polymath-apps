import {
  LOCATION_CHANGED,
  LocationChangedAction,
  push,
} from 'redux-little-router';

import { takeLatest, call, select, put } from 'redux-saga/effects';
import { RootState } from '~/state/store';
import {
  initializePolyClientStart,
  initializePolyClientFailure,
  initializePolyClientSuccess,
} from '~/state/actions/app';
import { polyClient } from '~/lib/polyClient';

const routeSagas: {
  [route: string]: () => IterableIterator<any>;
} = {
  '/dashboard': dashboardRouteSaga,
};

export function* initializePolyClient() {
  yield put(initializePolyClientStart());
  try {
    yield call(polyClient.initialize.bind(polyClient));
    yield put(initializePolyClientSuccess());
  } catch (error) {
    yield put(initializePolyClientFailure(error.message));
    throw error;
  }
}

export function* requireAppConnected() {
  const polyClientInitialized = yield select<RootState>(
    ({ app }) => app.polyClientInitialized
  );

  if (!polyClientInitialized) {
    yield initializePolyClient();
  }
}

export function* requireWallet() {
  const wallet = yield;
}

export function* dashboardRouteSaga() {
  yield call(requireAppConnected);
}

export function* processRouteChange(action: LocationChangedAction) {
  const route = action.payload.pathname as string;
  const routeSaga = routeSagas[route];
  if (routeSaga) {
    yield call(routeSaga);
  }
}

export function* routerWatcher() {
  yield takeLatest(LOCATION_CHANGED, processRouteChange);
}
