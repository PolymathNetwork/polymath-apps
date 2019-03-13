import { types } from '@polymathnetwork/new-shared';
import { createEntityActions } from '~/state/helpers/createEntityActions';
import { createStandardAction } from 'typesafe-actions';

const confirmTransactionQueue = createStandardAction(
  'TRANSACTION_QUEUES/CONFIRM'
)();

const cancelTransactionQueue = createStandardAction(
  'TRANSACTION_QUEUES/CANCEL'
)();

const finishTransactionQueue = createStandardAction(
  'TRANSACTION_QUEUES/FINISH'
)();

const { createAction, updateAction, deleteAction } = createEntityActions<
  types.TransactionQueueEntity
>('TRANSACTION_QUEUES');

export {
  createAction,
  updateAction,
  deleteAction,
  confirmTransactionQueue,
  cancelTransactionQueue,
  finishTransactionQueue,
};
