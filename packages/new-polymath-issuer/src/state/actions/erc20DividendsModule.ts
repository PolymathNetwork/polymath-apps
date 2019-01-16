import { types } from '@polymathnetwork/new-shared';
import { createEntityActions } from '~/state/helpers/createEntityActions';

const { createAction, updateAction, deleteAction } = createEntityActions<
  types.Erc20DividendsModuleEntity
>('ERC20_DIVIDENDS_MODULES');

export { createAction, updateAction, deleteAction };
