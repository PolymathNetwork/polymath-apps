import { createStandardAction } from 'typesafe-actions';

export const setActiveTransactionQueue = createStandardAction(
  'APP/SET_ACTIVE_TRANSACTION_QUEUE'
)<string>();

export const unsetActiveTransactionQueue = createStandardAction(
  'APP/UNSET_ACTIVE_TRANSACTION_QUEUE'
)();

export const initializePolyClientStart = createStandardAction(
  'APP/INITIALIZE_POLY_CLIENT_START'
)();

export const initializePolyClientSuccess = createStandardAction(
  'APP/INITIALIZE_POLY_CLIENT_SUCCESS'
)();

export const initializePolyClientFailure = createStandardAction(
  'APP/INITIALIZE_POLY_CLIENT_FAILURE'
)<Error>();

export const setChangingRoute = createStandardAction('APP/SET_CHANGING_ROUTE')<
  boolean
>();

export const setNetworkId = createStandardAction('APP/SET_NETWORK_ID')<
  number
>();
