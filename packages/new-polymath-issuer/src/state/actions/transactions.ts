import { createEntityActions } from '~/state/helpers/createEntityActions';
import { Transaction } from '~/types';

const { createAction, updateAction, deleteAction } = createEntityActions<
  Transaction
>('TRANSACTIONS');

export { createAction, updateAction, deleteAction };
