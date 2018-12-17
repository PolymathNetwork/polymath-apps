import { push } from 'redux-little-router';
import { put, call, select } from 'redux-saga/effects';
import { getCurrentAddress, ErrorCodes } from '@polymathnetwork/sdk';
import { setWallet } from '~/state/actions/session';
import { RootState } from '../store';
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
    address = yield getCurrentAddress();
    if (address) {
      yield put(setWallet({ address }));
    }
  } catch (error) {
    // tslint:disable-next-line
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