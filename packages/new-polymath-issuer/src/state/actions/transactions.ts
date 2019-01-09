import { createEntityActions } from '~/state/helpers/createEntityActions';
import { TransactionEntity } from '~/types';
import { createStandardAction } from 'typesafe-actions';
import { PolyTransaction } from '@polymathnetwork/sdk/build/dist/entities/PolyTransaction';

const newTransaction = createStandardAction('TRANSACTIONS/NEW')<
  PolyTransaction<any>
>();

const { createAction, updateAction, deleteAction } = createEntityActions<
  TransactionEntity
>('TRANSACTIONS');

export { createAction, updateAction, deleteAction, newTransaction };
