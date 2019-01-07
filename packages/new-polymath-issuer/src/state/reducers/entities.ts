import {
  createEntityReducer,
  EntityState,
} from '~/state/helpers/createEntityReducer';
import {
  TransactionEntity,
  DividendEntity,
  CheckpointEntity,
  Erc20DividendsModuleEntity,
} from '~/types';
import { combineReducers } from 'redux';

export interface EntitiesState {
  transactions: EntityState<TransactionEntity>;
  checkpoints: EntityState<CheckpointEntity>;
  dividends: EntityState<DividendEntity>;
  erc20DividendsModules: EntityState<Erc20DividendsModuleEntity>;
}

export const reducer = combineReducers<EntitiesState>({
  transactions: createEntityReducer<TransactionEntity>('TRANSACTIONS'),
  checkpoints: createEntityReducer<CheckpointEntity>('CHECKPOINTS'),
  dividends: createEntityReducer<DividendEntity>('DIVIDENDS'),
  erc20DividendsModules: createEntityReducer<Erc20DividendsModuleEntity>(
    'ERC20_DIVIDENDS_MODULES'
  ),
});
