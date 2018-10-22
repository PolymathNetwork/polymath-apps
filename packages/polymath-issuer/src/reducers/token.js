// @flow

import { CONNECTED } from '@polymathnetwork/ui/components/EthNetworkWrapper';
import { setHelpersNetwork } from '@polymathnetwork/ui';
import { CountTransferManager } from '@polymathnetwork/js';
import type { Investor } from '@polymathnetwork/js/types';

import * as a from '../actions/token';
import { DATA } from '../actions/providers';

import type { Action, InvestorCSVRow } from '../actions/token';
import type { ServiceProvider } from '../pages/providers/data';

// NOTE @RafaelVidaurre: Duplicating this type since typing between packags is
// currently broken (should be in polymathjs)

type SecurityToken = {|
  ticker: string,
  name: string,
  owner: string,
  expires: ?Date,
  timestamp: Date,
  txHash: string,
  address: string,
  isDivisible?: boolean,
  details?: string,
  contract?: any,
|};

export type TokenState = {
  token: ?SecurityToken,
  isFetched: boolean,
  providers: ?Array<ServiceProvider>,
  isMintingFrozen: boolean,
  mint: {
    uploaded: Array<Investor>,
    uploadedTokens: Array<number>,
    criticals: Array<InvestorCSVRow>,
    isTooMany: boolean,
  },
  countTM: {
    contract: ?CountTransferManager,
    isPaused: boolean,
    count: ?number,
  },
};

const defaultState: TokenState = {
  token: null,
  isFetched: false,
  providers: null,
  isMintingFrozen: true,
  mint: {
    uploaded: [],
    uploadedTokens: [],
    criticals: [],
    isTooMany: false,
  },
  countTM: {
    contract: null,
    isPaused: true,
    count: null,
  },
};

export default (state: TokenState = defaultState, action: Action) => {
  switch (action.type) {
    case a.DATA:
      return {
        ...state,
        token: action.token,
        isFetched: true,
      };
    case a.COUNT_TM:
      return {
        ...state,
        countTM: {
          contract: action.tm,
          isPaused: action.isPaused,
          count: action.count || state.countTM.count,
        },
      };
    case a.MINTING_FROZEN:
      return {
        ...state,
        isMintingFrozen: action.isMintingFrozen,
      };
    case a.MINT_UPLOADED:
      return {
        ...state,
        mint: {
          uploaded: action.investors,
          uploadedTokens: action.tokens,
          criticals: action.criticals,
          isTooMany: action.isTooMany,
        },
      };
    case a.MINT_RESET_UPLOADED:
      return {
        ...state,
        mint: defaultState.mint,
      };
    case DATA:
      return {
        ...state,
        providers: action.providers,
      };
    case CONNECTED:
      setHelpersNetwork(action.params.name);
      return state;
    default:
      return state;
  }
};
