import { types } from '@polymathnetwork/new-shared';
import { createEntityActions } from '~/state/helpers/createEntityActions';

const { createAction, updateAction, deleteAction } = createEntityActions<
  types.TaxWithholdingEntity
>('TAX_WITHHOLDINGS');

export { createAction, updateAction, deleteAction };
