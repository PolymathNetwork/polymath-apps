import { createStandardAction } from 'typesafe-actions';

export const setActiveTransactionGroup = createStandardAction(
  'APP/SET_ACTIVE_TRANSACTION_GROUP'
)<string>();
