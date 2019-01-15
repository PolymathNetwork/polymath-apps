import { types } from '@polymathnetwork/new-shared';
import { createEntityActions } from '~/state/helpers/createEntityActions';

const { createAction, updateAction, deleteAction } = createEntityActions<
  types.CheckpointEntity
>('CHECKPOINTS');

export { createAction, updateAction, deleteAction };
