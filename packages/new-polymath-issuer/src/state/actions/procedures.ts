import { createStandardAction } from 'typesafe-actions';
import { DividendModuleTypes } from '@polymathnetwork/sdk';
import BigNumber from 'bignumber.js';

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

const createErc20DividendDistributionStart = createStandardAction(
  'PROCEDURES/CREATE_ERC20_DIVIDEND_DISTRIBUTION_START'
)<{
  securityTokenSymbol: string;
  maturityDate: Date;
  expiryDate: Date;
  erc20Address: string;
  amount: BigNumber;
  checkpointIndex: number;
  name: string;
  excludedAddresses: string[];
  pushPaymentsWhenComplete: boolean;
}>();

const pushDividendPaymentStart = createStandardAction(
  'PROCEDURES/PUSH_DIVIDEND_PAYMENT_START'
)<{
  securityTokenSymbol: string;
  dividendType: DividendModuleTypes;
  dividendIndex: number;
}>();

const setDividendsWalletStart = createStandardAction(
  'PROCEDURES/SET_DIVIDENDS_WALLET_START'
)<{
  securityTokenSymbol: string;
  dividendType: DividendModuleTypes;
  walletAddress: string;
}>();

const withdrawDividendTaxesStart = createStandardAction(
  'PROCEDURES/WITHDRAW_DIVIDEND_TAXES_START'
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
  setDividendsWalletStart,
  withdrawDividendTaxesStart,
  createErc20DividendDistributionStart,
};
