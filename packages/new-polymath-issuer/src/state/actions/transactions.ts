import { createEntityActions } from '~/state/helpers/createEntityActions';
import { types } from '@polymathnetwork/new-shared';

const { createAction, updateAction, deleteAction } = createEntityActions<
  types.TransactionEntity
>('TRANSACTIONS');

export { createAction, updateAction, deleteAction };
