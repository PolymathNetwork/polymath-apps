import {
  createEntityReducer,
  EntityState,
} from '~/state/helpers/createEntityReducer';
import { types } from '@polymathnetwork/new-shared';
import { combineReducers } from 'redux';

export interface EntitiesState {
  transactions: EntityState<types.TransactionEntity>;
  checkpoints: EntityState<types.CheckpointEntity>;
  dividends: EntityState<types.DividendEntity>;
  erc20DividendsModules: EntityState<types.Erc20DividendsModuleEntity>;
  transactionQueues: EntityState<types.TransactionQueueEntity>;
  taxWithholdings: EntityState<types.TaxWithholdingEntity>;
}

export const reducer = combineReducers<EntitiesState>({
  transactions: createEntityReducer<types.TransactionEntity>('TRANSACTIONS'),
  checkpoints: createEntityReducer<types.CheckpointEntity>('CHECKPOINTS'),
  dividends: createEntityReducer<types.DividendEntity>('DIVIDENDS'),
  erc20DividendsModules: createEntityReducer<types.Erc20DividendsModuleEntity>(
    'ERC20_DIVIDENDS_MODULES'
  ),
  transactionQueues: createEntityReducer<types.TransactionQueueEntity>(
    'TRANSACTION_QUEUES'
  ),
  taxWithholdings: createEntityReducer<types.TaxWithholdingEntity>(
    'TAX_WITHHOLDINGS'
  ),
});
