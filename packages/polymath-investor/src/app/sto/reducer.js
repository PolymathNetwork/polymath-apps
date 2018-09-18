// @flow

import { STO } from '@polymathnetwork/js';
import type { SecurityToken, STODetails } from '@polymathnetwork/js';

import * as a from './actions';
import type { Action } from './actions';

export type STOState = {
  isFetched: boolean,
  token: ?SecurityToken,
  sto: ?STO,
  details: ?STODetails,
  isPaused: ?boolean,
  isPurchaseModalOpen: boolean,
};

const defaultState: STOState = {
  isFetched: false,
  token: null,
  sto: null,
  details: null,
  isPaused: null,
  isPurchaseModalOpen: false,
};

export default (state: STOState = defaultState, action: Action) => {
  switch (action.type) {
    case a.DATA:
      return {
        ...state,
        isFetched: true,
        token: action.token,
        sto: action.sto,
        details: action.details,
      };
    case a.PAUSE_STATUS:
      return {
        ...state,
        isPaused: action.status,
      };
    case a.PURCHASE_MODAL_OPEN:
      return {
        ...state,
        isPurchaseModalOpen: true,
      };
    case a.PURCHASE_MODAL_CLOSE:
      return {
        ...state,
        isPurchaseModalOpen: false,
      };
    default:
      return state;
  }
};
