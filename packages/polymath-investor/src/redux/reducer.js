// @flow

import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import {
  uiReducer as pui,
  networkReducer as network,
} from '@polymathnetwork/ui';
import type { PUIState, NetworkState } from '@polymathnetwork/ui';

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
