// @flow

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as form } from 'redux-form';
import {
  uiReducer as pui,
  networkReducer as network,
} from '@polymathnetwork/ui';
import type { PUIState, NetworkState } from '@polymathnetwork/ui';
import { reducer as entities } from '@polymathnetwork/new-issuer/state/reducers/entities';
import { reducer as dataRequests } from '@polymathnetwork/new-issuer/state/reducers/dataRequests';
import { reducer as app } from '@polymathnetwork/new-issuer/state/reducers/app';
import { reducer as session } from '@polymathnetwork/new-issuer/state/reducers/session';

import providers from '../reducers/providers';
import token from '../reducers/token';
import sto from '../reducers/sto';
import ticker from '../reducers/ticker';
import whitelist from '../reducers/compliance';
import stoModules from '../reducers/stoModules';
import ui from '../reducers/ui';
import restrictions from '../reducers/restrictions';
import account from '../reducers/account';

import type { ProvidersState } from '../reducers/providers';
import type { TokenState } from '../reducers/token';
import type { STOState } from '../reducers/sto';
import type { TickerState } from '../reducers/ticker';
import type { WhitelistState } from '../reducers/compliance';
import type { STOModulesState } from '../reducers/stoModules';
import type { UIState } from '../reducers/ui';

export default history =>
  combineReducers({
    network,
    form,
    ticker,
    providers,
    token,
    sto,
    stoModules,
    pui,
    ui,
    whitelist,
    entities,
    dataRequests,
    app,
    session,
    restrictions,
    account,
    router: connectRouter(history),
  });

export type RootState = {
  network: NetworkState,
  providers: ProvidersState,
  ticker: TickerState,
  token: TokenState,
  sto: STOState,
  whitelist: WhitelistState,
  pui: PUIState,
  ui: UIState,
  stoModules: STOModulesState,
  form: any,
};

export type GetState = () => RootState;
