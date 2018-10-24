// @flow

import { combineReducers } from 'redux';

import common from './common/reducer';
import account from './account/reducer';

import toaster from '../components/Toaster/reducer';
import tx from '../components/TxModal/reducer';
import modal from '../components/ConfirmModal/reducer';
import notice from '../components/NoticeBar/reducer';

import type { TxState } from '../components/TxModal/reducer';
import type { ToasterState } from '../components/Toaster/reducer';
import type { ModalState } from '../components/ConfirmModal/reducer';
import type { NoticeState } from '../components/NoticeBar/reducer';
import type { NetworkState } from '../components/EthNetworkWrapper/reducer';
import type { CommonState } from './common/reducer';
import type { AccountState } from './account/reducer';

export const uiReducer = combineReducers({
  common,
  toaster,
  tx,
  account,
  modal,
  notice,
});

export {
  default as networkReducer,
} from '../components/EthNetworkWrapper/reducer';

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

export type { NetworkState };

export type GetState = () => RootState;
