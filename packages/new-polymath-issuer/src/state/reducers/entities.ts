import { createEntityReducer } from '~/state/helpers/createEntityReducer';
import { Transaction, TransactionGroup } from '~/types';
import { combineReducers } from 'redux';

export const reducer = combineReducers({
  transactions: createEntityReducer<Transaction>('TRANSACTIONS'),
  transactionGroups: createEntityReducer<TransactionGroup>(
    'TRANSACTION_GROUPS'
  ),
});
