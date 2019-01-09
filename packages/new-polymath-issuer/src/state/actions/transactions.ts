import { createEntityActions } from '~/state/helpers/createEntityActions';
import { TransactionEntity } from '~/types';

const { createAction, updateAction, deleteAction } = createEntityActions<
  TransactionEntity
>('TRANSACTIONS');

export { createAction, updateAction, deleteAction };
