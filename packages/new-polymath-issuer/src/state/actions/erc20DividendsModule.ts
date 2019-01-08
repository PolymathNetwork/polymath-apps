import { Erc20DividendsModuleEntity } from '~/types';
import { createEntityActions } from '~/state/helpers/createEntityActions';
import { createStandardAction } from 'typesafe-actions';

const { createAction, updateAction, deleteAction } = createEntityActions<
  Erc20DividendsModuleEntity
>('ERC20_DIVIDENDS_MODULES');

const enableModule = createStandardAction('ERC20_DIVIDENDS_MODULES/ENABLE')<{
  securityTokenSymbol: string;
}>();

export { createAction, updateAction, deleteAction, enableModule };
