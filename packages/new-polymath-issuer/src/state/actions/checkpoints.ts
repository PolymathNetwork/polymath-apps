import { CheckpointEntity } from '~/types';
import { createEntityActions } from '~/state/helpers/createEntityActions';

const { createAction, updateAction, deleteAction } = createEntityActions<
  CheckpointEntity
>('CHECKPOINTS');

export { createAction, updateAction, deleteAction };
