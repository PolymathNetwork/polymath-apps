import { push } from 'redux-little-router';
import { put, call, select } from 'redux-saga/effects';
import { browserUtils, ErrorCodes } from '@polymathnetwork/sdk';
import { setWallet } from '~/state/actions/session';
import { RootState } from '~/state/store';
import { initializePolyClient } from './app';

export function* requireWallet(
  params: { redirect: boolean } = { redirect: true }
) {
  let address: string;
  const wallet = yield select<RootState>(({ session }) => session.wallet);
  if (wallet) {
    return;
  }
  try {
    address = yield call(browserUtils.getCurrentAddress);
    if (address) {
      yield put(setWallet({ address }));
    }
  } catch (error) {
    const code = error.code as ErrorCodes;

    switch (code) {
      case ErrorCodes.UserDeniedAccess: {
        if (params.redirect) {
          yield put(push('/login'));
        }
        break;
      }
      case ErrorCodes.IncompatibleBrowser: {
        if (params.redirect) {
          yield put(push('/metamask/get'));
        }
        break;
      }
      case ErrorCodes.WalletIsLocked: {
        if (params.redirect) {
          yield put(push('/metamask/locked'));
        }
        break;
      }
      default: {
        throw error;
      }
    }
  }
}

export function* requireAnonymous() {
  yield call(requireWallet, { redirect: false });
  const wallet = yield select<RootState>(({ session }) => session.wallet);

  if (wallet) {
    yield put(push('/'));
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
