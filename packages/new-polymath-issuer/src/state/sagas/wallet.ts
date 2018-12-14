import { all, put, takeEvery, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { onAddressChange } from '@polymathnetwork/sdk';
import { setWallet } from '~/state/actions/session';

const listenToAddressChange = eventChannel(onAddressChange);

export function* processAddressChange(newAddress: string) {
  yield put(setWallet({ address: newAddress }));
}

export function* walletWatcher() {
  yield all([takeEvery(listenToAddressChange, processAddressChange)]);
}
