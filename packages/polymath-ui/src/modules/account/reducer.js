// @flow

import BigNumber from 'bignumber.js';
import * as a from './actions';
import type { Action } from './actions';

export type AccountState = {
  isSignedUp: ?boolean,
  isSignedIn: ?boolean,
  isSignInCancelled: ?boolean,
  name: ?string,
  email: ?string,
  isEmailConfirmed: ?boolean,
  isEnterPINModalOpen: boolean,
  isEnterPINSuccess: boolean,
  isEnterPINError: boolean,
  balance: ?BigNumber,
};

const defaultState: AccountState = {
  isSignedUp: null,
  isSignedIn: false,
  isSignInCancelled: false,
  name: null,
  email: null,
  isEmailConfirmed: null,
  isEnterPINModalOpen: false,
  isEnterPINSuccess: false,
  isEnterPINError: false,
  balance: null,
};
// eslint-disable-next-line complexity
export default (state: AccountState = defaultState, action: Action) => {
  switch (action.type) {
    case a.SIGN_IN_START:
      return {
        ...state,
        isSignInCancelled: false,
      };
    case a.SIGN_IN_CANCEL:
      return {
        ...state,
        isSignInCancelled: true,
      };
    case a.SIGNED_IN:
      return {
        ...state,
        isSignedIn: true,
      };
    case a.SIGNED_UP:
      return {
        ...state,
        isSignedUp: true,
        name: action.name,
        email: action.email,
        isEmailConfirmed: action.isEmailConfirmed,
      };
    case a.REQUEST_CONFIRM_EMAIL:
      return {
        ...state,
        isEnterPINModalOpen: true,
      };
    case a.CANCEL_CONFIRM_EMAIL:
      return {
        ...state,
        isEnterPINModalOpen: false,
        isEnterPINSuccess: false,
        isEnterPINError: false,
      };
    case a.ENTER_PIN_SUCCESS:
      return {
        ...state,
        isEnterPINError: false,
        isEnterPINSuccess: true,
        isEnterPINModalOpen: false,
      };
    case a.ENTER_PIN_ERROR:
      return {
        ...state,
        isEnterPINError: true,
      };
    case a.ENTER_PIN_DEFAULT:
      return {
        ...state,
        isEnterPINError: false,
        isEnterPINSuccess: false,
      };
    case a.EMAIL_CONFIRMED:
      return {
        ...state,
        isEmailConfirmed: true,
      };
    case a.BALANCE:
      return {
        ...state,
        balance: action.balance,
      };
    default:
      return state;
  }
};
