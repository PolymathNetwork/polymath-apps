import { createStandardAction } from 'typesafe-actions';

const enableErc20DividendsModuleStart = createStandardAction(
  'PROCEDURES/ENABLE_ERC20_DIVIDENDS_MODULE_START'
)<{
  securityTokenSymbol: string;
}>();

export { enableErc20DividendsModuleStart };
