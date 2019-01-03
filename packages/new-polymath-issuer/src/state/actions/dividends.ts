import { DividendEntity } from '~/types';
import { createEntityActions } from '~/state/helpers/createEntityActions';

const { createAction, updateAction, deleteAction } = createEntityActions<
  DividendEntity
>('DIVIDENDS');

export { createAction, updateAction, deleteAction };
