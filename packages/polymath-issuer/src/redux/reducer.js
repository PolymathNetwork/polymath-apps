// @flow

import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { reducer as network } from '@polymathnetwork/auth';
import { reducer as pui } from '@polymathnetwork/ui';
import type { PUIState } from '@polymathnetwork/ui';
import type { NetworkState } from '@polymathnetwork/auth';

import providers from '../reducers/providers';
import token from '../reducers/token';
import sto from '../reducers/sto';
import ticker from '../reducers/ticker';
import whitelist from '../reducers/compliance';
import account from '../reducers/account';

import type { ProvidersState } from '../reducers/providers';
import type { TokenState } from '../reducers/token';
import type { STOState } from '../reducers/sto';
import type { TickerState } from '../reducers/ticker';
import type { WhitelistState } from '../reducers/compliance';
import type { AccountState } from '../reducers/account';

export default combineReducers({
  network,
  form,
  ticker,
  providers,
  token,
  sto,
  pui,
  whitelist,
  account,
});

export type RootState = {
  network: NetworkState,
  providers: ProvidersState,
  ticker: TickerState,
  token: TokenState,
  sto: STOState,
  whitelist: WhitelistState,
  pui: PUIState,
  form: any,
  account: AccountState,
};

export type GetState = () => RootState;
