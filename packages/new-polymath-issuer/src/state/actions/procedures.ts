import { createStandardAction } from 'typesafe-actions';
import { DividendModuleTypes } from '@polymathnetwork/sdk';

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

const updateTaxWithholdingListStart = createStandardAction(
  'PROCEDURES/UPDATE_TAX_WITHHOLDING_LIST_START'
)<{
  securityTokenSymbol: string;
  dividendType: DividendModuleTypes;
  investorAddresses: string[];
  percentages: number[];
}>();

const pushDividendPaymentStart = createStandardAction(
  'PROCEDURES/PUSH_DIVIDEND_PAYMENT_START'
)<{
  securityTokenSymbol: string;
  dividendType: DividendModuleTypes;
  dividendIndex: number;
}>();

export {
  enableErc20DividendsModuleStart,
  createCheckpointStart,
  updateTaxWithholdingListStart,
  pushDividendPaymentStart,
};
