import { all, put, takeLatest } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { browserUtils } from '@polymathnetwork/sdk';
import { setWallet } from '~/state/actions/session';

const addressChangeChannel = eventChannel(browserUtils.onAddressChange);

export function* processAddressChange(newAddress: string) {
  yield put(setWallet({ address: newAddress }));
}

export function* walletWatcher() {
  // @ts-ignore
  yield all([takeLatest(addressChangeChannel, processAddressChange)]);
}
