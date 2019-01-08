import { createStandardAction } from 'typesafe-actions';

export const setActiveSequence = createStandardAction(
  'APP/SET_ACTIVE_SEQUENCE'
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

export const setChangingRoute = createStandardAction('APP/SET_CHANGING_ROUTE')<
  boolean
>();
