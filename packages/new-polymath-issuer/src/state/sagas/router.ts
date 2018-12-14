import { LOCATION_CHANGED, LocationChangedAction } from 'redux-little-router';
import { takeLatest, call } from 'redux-saga/effects';
import { requireAppConnected, requireAnonymous } from './accessControl';

export function* handleDashboardRoute() {
  yield call(requireAppConnected);
}
export function* handleLoginRoute() {
  yield call(requireAnonymous);
}

export function* processRouteChange(action: LocationChangedAction) {
  const routeSaga = (action.payload.result as any).handler;
  if (routeSaga) {
    yield call(routeSaga);
  }
}

export function* routerWatcher() {
  yield takeLatest(LOCATION_CHANGED, processRouteChange);
}
