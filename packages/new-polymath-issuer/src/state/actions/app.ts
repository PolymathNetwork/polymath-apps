import { createStandardAction } from 'typesafe-actions';

export const setActiveTransactionGroup = createStandardAction(
  'APP/SET_ACTIVE_TRANSACTION_GROUP'
)<string>();

export const initializePolyClientStart = createStandardAction(
  'APP/INITIALIZE_POLY_CLIENT_START'
)();

export const initializePolyClientSuccess = createStandardAction(
  'APP/INITIALIZE_POLY_CLIENT_SUCCESS'
)();

export const initializePolyClientFailure = createStandardAction(
  'APP/INITIALIZE_POLY_CLIENT_FAILURE'
)<Error>();
