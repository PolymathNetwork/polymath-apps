import { takeLatest, all } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import { loginStart } from '~/state/actions/session';
import { requireWallet } from './accessControl';

export function* processLogin() {
  yield requireWallet();
}

export function* sessionWatcher() {
  yield all([takeLatest(getType(loginStart), processLogin)]);
}
