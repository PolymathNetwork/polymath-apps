import { Erc20DividendsModuleEntity } from '~/types';
import { createEntityActions } from '~/state/helpers/createEntityActions';

const { createAction, updateAction, deleteAction } = createEntityActions<
  Erc20DividendsModuleEntity
>('ERC20_DIVIDENDS_MODULES');

export { createAction, updateAction, deleteAction };
