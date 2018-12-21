import { createStandardAction } from 'typesafe-actions';
import { Checkpoint } from '@polymathnetwork/sdk';
import { CheckpointEntity } from '~/types';
import { createEntityActions } from '~/state/helpers/createEntityActions';

const { createAction, updateAction, deleteAction } = createEntityActions<
  CheckpointEntity
>('CHECKPOINTS');

const fetchCheckpoints = createStandardAction('CHECKPOINTS/FETCH')<string>();

const fetchCheckpointsSuccess = createStandardAction(
  'CHECKPOINTS/FETCH_SUCCESS'
)<Checkpoint[]>();

const fetchCheckpointsError = createStandardAction('CHECKPOINTS/FETCH_ERROR')<
  Error
>();

export {
  createAction,
  updateAction,
  deleteAction,
  fetchCheckpoints,
  fetchCheckpointsSuccess,
  fetchCheckpointsError,
};
