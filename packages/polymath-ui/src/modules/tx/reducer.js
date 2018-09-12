// @flow

import type { Web3Receipt } from '@polymathnetwork/js/types';

import * as a from './actions';
import type { Action } from './actions';

export type TxState = {
  titles: Array<string>,
  successTitle: ?string,
  continueCode: ?() => void,
  continueRoute: ?string,
  continueLabel: ?string,
  isNoEmail: boolean,
  hashes: Array<string>,
  receipts: Array<Web3Receipt>,
  total: ?number,
  current: ?number,
  isFinished: ?boolean,
  error: ?Error,
  headingOverride: ?string,
};

const defaultState = {
  titles: [],
  successTitle: null,
  continueCode: null,
  continueRoute: null,
  continueLabel: null,
  isNoEmail: false,
  hashes: [],
  receipts: [],
  total: null,
  current: null,
  isFinished: null,
  error: null,
  headingOverride: null,
};

export default (state: TxState = defaultState, action: Action) => {
  switch (action.type) {
    case a.START:
      return {
        ...defaultState,
        ...action,
        current: 0,
        total: action.titles.length,
      };
    case a.HASH:
      return {
        ...state,
        hashes: state.hashes.concat(action.hash),
      };
    case a.END:
      const receipts = state.receipts.concat(action.receipt);
      const current = receipts.length;
      let isFinished = false; // $FlowFixMe
      if (current === state.total) {
        isFinished = true;
      }
      return {
        ...state,
        current: receipts.length,
        receipts,
        isFinished,
      };
    case a.FAILED:
      return {
        ...state,
        error: action.error,
      };
    case a.CONTINUE:
      return {
        ...state,
        total: null,
      };
    default:
      return state;
  }
};
