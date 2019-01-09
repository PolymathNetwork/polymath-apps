import { SequenceEntity } from '~/types';
import { createEntityActions } from '~/state/helpers/createEntityActions';
import { createStandardAction } from 'typesafe-actions';

const confirmSequence = createStandardAction('SEQUENCES/CONFIRM')();

const { createAction, updateAction, deleteAction } = createEntityActions<
  SequenceEntity
>('SEQUENCES');

export { createAction, updateAction, deleteAction, confirmSequence };
