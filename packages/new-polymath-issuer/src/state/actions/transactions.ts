import { createEntityActions } from '~/state/helpers/createEntityActions';
import { types } from '@polymathnetwork/new-shared';
import { PolyTransaction } from '@polymathnetwork/sdk';
import { createStandardAction } from 'typesafe-actions';

const newTransaction = createStandardAction('TRANSACTIONS/NEW')<
  PolyTransaction
>();

const { createAction, updateAction, deleteAction } = createEntityActions<
  types.TransactionEntity
>('TRANSACTIONS');

export { createAction, updateAction, deleteAction, newTransaction };
