import {
  LOCATION_CHANGED,
  LocationChangedAction,
  push,
} from 'redux-little-router';
import { takeLatest, call, put } from 'redux-saga/effects';
import { setChangingRoute } from '~/state/actions/app';
import { requireAppConnected, requireAnonymous } from './accessControl';

export function* handleDashboardRoute() {
  yield call(requireAppConnected);
}
export function* handleLoginRoute() {
  yield call(requireAnonymous);
}
export function* handleSecurityTokensRoute() {
  yield call(requireAppConnected);
}
export function* handleDividendsRoute() {
  yield call(requireAppConnected);
}

export function* processRouteChange(action: LocationChangedAction) {
  yield put(setChangingRoute(true));

  const result = action.payload.result;
  if (!result || !result.Page) {
    yield put(push('/notFound'));
    yield put(setChangingRoute(false));
    return;
  }

  const routeSaga = (action.payload.result as any).handler;

  if (routeSaga) {
    yield call(routeSaga);
  }
  yield put(setChangingRoute(false));
}

export function* routerWatcher() {
  yield takeLatest(LOCATION_CHANGED, processRouteChange);
}
