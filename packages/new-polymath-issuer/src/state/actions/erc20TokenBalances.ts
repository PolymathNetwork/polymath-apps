import { types } from '@polymathnetwork/new-shared';
import { createEntityActions } from '~/state/helpers/createEntityActions';

const { createAction, updateAction, deleteAction } = createEntityActions<
  types.Erc20TokenBalanceEntity
>('ERC20_TOKEN_BALANCES');

export { createAction, updateAction, deleteAction };
