import { createStandardAction } from 'typesafe-actions';
import { Id } from '~/types';

export const setActiveTransactionGroup = createStandardAction(
  'APP/SET_ACTIVE_TRANSACTION_GROUP'
)<Id>();
