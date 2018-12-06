import { createStandardAction } from 'typesafe-actions';
import { NetworkStatus, NetworkClientSupport } from '~/types';

export const setStatus = createStandardAction('NETWORK/SET_STATUS')<
  NetworkStatus
>();
export const setClientSupport = createStandardAction(
  'NETWORK/SET_CLIENT_SUPPORT'
)<NetworkClientSupport>();
