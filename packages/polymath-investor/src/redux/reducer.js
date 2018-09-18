// @flow

import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { reducer as network } from '@polymathnetwork/auth';
import { reducer as pui } from '@polymathnetwork/ui';
import type { PUIState } from '@polymathnetwork/ui';
import type { NetworkState } from '@polymathnetwork/auth';

import sto from '../app/sto/reducer';
import type { STOState } from '../app/sto/reducer';

export default combineReducers({
  network,
  sto,
  pui,
  form,
});

export type RootState = {
  network: NetworkState,
  sto: STOState,
  pui: PUIState,
  form: any,
};

export type GetState = () => RootState;
