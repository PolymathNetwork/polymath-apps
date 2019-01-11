import { types } from '@polymathnetwork/new-shared';
import { createEntityActions } from '~/state/helpers/createEntityActions';
import { createStandardAction } from 'typesafe-actions';

const confirmTransactionQueue = createStandardAction(
  'TRANSACTION_QUEUES/CONFIRM'
)();

const { createAction, updateAction, deleteAction } = createEntityActions<
  types.TransactionQueueEntity
>('TRANSACTION_QUEUES');

export { createAction, updateAction, deleteAction, confirmTransactionQueue };
