import {
  createEntityReducer,
  EntityState,
} from '~/state/helpers/createEntityReducer';
import {
  TransactionEntity,
  DividendEntity,
  CheckpointEntity,
  Entities,
} from '~/types';
import { combineReducers } from 'redux';

export interface EntitiesState {
  transactions: EntityState<TransactionEntity>;
  checkpoints: EntityState<CheckpointEntity>;
  dividends: EntityState<DividendEntity>;
}

export const reducer = combineReducers<EntitiesState>({
  transactions: createEntityReducer<TransactionEntity>('TRANSACTIONS'),
  checkpoints: createEntityReducer<CheckpointEntity>('CHECKPOINTS'),
  dividends: createEntityReducer<DividendEntity>('DIVIDENDS'),
});
