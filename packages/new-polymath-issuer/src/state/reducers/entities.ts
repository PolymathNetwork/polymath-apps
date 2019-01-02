import { createEntityReducer } from '~/state/helpers/createEntityReducer';
import { Transaction } from '~/types';
import { combineReducers } from 'redux';

export const reducer = combineReducers({
  transactions: createEntityReducer<Transaction>('TRANSACTIONS'),
});
