// @flow

import { combineReducers } from 'redux';
import type { NetworkState } from '@polymathnetwork/auth';

import common from './common/reducer';
import toaster from '../components/Toaster/reducer';
import tx from '../components/TxModal/reducer';
import modal from '../components/ConfirmModal/reducer';
import notice from '../components/NoticeBar/reducer';
import type { TxState } from '../components/TxModal/reducer';
import type { ToasterState } from '../components/toaster/reducer';
import type { CommonState } from './common/reducer';
import type { ModalState } from '../components/ConfirmModal/reducer';
import type { NoticeState } from '../components/NoticeBar/reducer';

export default combineReducers({
  common,
  toaster,
  tx,
  modal,
  notice,
});

export type PUIState = {
  common: CommonState,
  tx: TxState,
  toaster: ToasterState,
  modal: ModalState,
  notice: NoticeState,
};

export type RootState = {
  form: any, // redux-form
  network: NetworkState,
  pui: PUIState,
};

export type GetState = () => RootState;
