import { createStandardAction } from 'typesafe-actions';
import { Wallet, Identity } from '~/types';

export const setWallet = createStandardAction('SESSION/SET_WALLET')<Wallet>();
export const setIdentity = createStandardAction('SESSION/SET_IDENTITY')<
  Identity
>();
