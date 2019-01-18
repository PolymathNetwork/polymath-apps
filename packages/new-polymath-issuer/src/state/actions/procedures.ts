import { createStandardAction } from 'typesafe-actions';

const enableErc20DividendsModuleStart = createStandardAction(
  'PROCEDURES/ENABLE_ERC20_DIVIDENDS_MODULE_START'
)<{
  securityTokenSymbol: string;
  storageWalletAddress: string;
}>();

const createCheckpointStart = createStandardAction(
  'PROCEDURES/CREATE_CHECKPOINT_START'
)<{
  securityTokenSymbol: string;
}>();

export { enableErc20DividendsModuleStart, createCheckpointStart };
