// @flow

import type { SymbolDetails } from '@polymathnetwork/js/types';

import * as a from '../actions/ticker';
import type { Action } from '../actions/ticker';

export type TickerState = {
  expiryLimit: number,
  isTickerReserved: boolean,
  tokens: Array<SymbolDetails>,
  hasLegacyTokens: boolean,
  legacyTokens: Array<{|
    address: string,
    ticker: string,
  |}>,
};

const defaultState: TickerState = {
  expiryLimit: 15,
  isTickerReserved: false,
  tokens: [],
  legacyTokens: [],
  hasLegacyTokens: false,
};

export default (state: TickerState = defaultState, action: Action) => {
  switch (action.type) {
    case a.EXPIRY_LIMIT:
      return {
        ...state,
        expiryLimit: action.value,
      };
    case a.TOKENS:
      return {
        ...state,
        tokens: action.tokens,
      };
    case a.RESERVED:
      return {
        ...state,
        isTickerReserved: true,
      };
    case a.LEGACY_TOKENS:
      const { legacyTokens } = action;
      return {
        ...state,
        hasLegacyTokens: legacyTokens.length > 0,
        legacyTokens: legacyTokens,
      };
    default:
      return state;
  }
};
