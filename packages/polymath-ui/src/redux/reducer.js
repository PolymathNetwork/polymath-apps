// @flow

import { combineReducers } from 'redux';
import type { NetworkState } from '@polymathnetwork/auth';

import common from './common/reducer';
import toaster from '../modules/toaster/reducer';
import tx from '../modules/tx/reducer';
import account from '../modules/account/reducer';
import modal from '../modules/modal/reducer';
import notice from '../modules/notice/reducer';
import type { TxState } from '../modules/tx/reducer';
import type { ToasterState } from '../modules/toaster/reducer';
import type { CommonState } from './common/reducer';
import type { AccountState } from '../modules/account/reducer';
import type { ModalState } from '../modules/modal/reducer';
import type { NoticeState } from '../modules/notice/reducer';

export default combineReducers({
  common,
  toaster,
  tx,
  account,
  modal,
  notice,
});

export type PUIState = {
  common: CommonState,
  tx: TxState,
  toaster: ToasterState,
  account: AccountState,
  modal: ModalState,
  notice: NoticeState,
};

export type RootState = {
  form: any, // redux-form
  network: NetworkState,
  pui: PUIState,
};

export type GetState = () => RootState;
