import {
  LOCATION_CHANGED,
  LocationChangedAction,
  push,
} from 'redux-little-router';
import { getCurrentAddress } from '@polymathnetwork/sdk';
import { takeLatest, call, select, put } from 'redux-saga/effects';
import { ErrorCodes as PolymathErrorCodes } from '@polymathnetwork/sdk';
import { RootState } from '~/state/store';
import {
  initializePolyClientStart,
  initializePolyClientFailure,
  initializePolyClientSuccess,
} from '~/state/actions/app';
import { polyClient } from '~/lib/polyClient';
import { setWallet } from '~/state/actions/session';

const routeSagas: {
  [route: string]: () => IterableIterator<any>;
} = {
  '/dashboard': dashboardRouteSaga,
};

export function* initializePolyClient() {
  yield put(initializePolyClientStart());
  yield requireWallet();
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
  let address: string;
  try {
    address = yield call(getCurrentAddress);
    yield put(setWallet({ address }));
  } catch (error) {
    // tslint:disable-next-line
    const code = error.code as PolymathErrorCodes;

    switch (code) {
      case PolymathErrorCodes.UserDeniedAccess: {
        yield put(push('/login'));
        break;
      }
      case PolymathErrorCodes.IncompatibleBrowser: {
        yield put(push('/metamask/get'));
        break;
      }
      case PolymathErrorCodes.WalletIsLocked: {
        yield put(push('/metamask/locked'));
        break;
      }
      default: {
        throw error;
      }
    }
  }
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
