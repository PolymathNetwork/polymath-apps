import { createStandardAction } from 'typesafe-actions';
import { Wallet, Identity } from '~/types';

export const setWallet = createStandardAction('SESSION/SET_WALLET')<Wallet>();
export const setIdentity = createStandardAction('SESSION/SET_IDENTITY')<
  Identity
>();
export const login = createStandardAction('SESSION/LOGIN_START')();

export const loginSuccessful = createStandardAction(
  'SESSION/LOGIN_SUCCESSFUL'
)();
export const loginFailed = createStandardAction('SESSION/LOGIN_SUCCESSFUL')();
