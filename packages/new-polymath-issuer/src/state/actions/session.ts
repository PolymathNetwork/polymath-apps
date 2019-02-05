import { createStandardAction } from 'typesafe-actions';
import { Wallet, Identity } from '~/types';

export const setWallet = createStandardAction('SESSION/SET_WALLET')<Wallet>();
export const setIdentity = createStandardAction('SESSION/SET_IDENTITY')<
  Identity
>();
export const loginStart = createStandardAction('SESSION/LOGIN_START')();

export const loginSuccess = createStandardAction('SESSION/LOGIN_SUCCESS')();
export const loginFailed = createStandardAction('SESSION/LOGIN_FAILED')();
