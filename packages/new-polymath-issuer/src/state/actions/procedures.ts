import { createStandardAction } from 'typesafe-actions';
import { DividendModuleTypes } from '@polymathnetwork/sdk';
import BigNumber from 'bignumber.js';

const enableErc20DividendsModuleStart = createStandardAction(
  'PROCEDURES/ENABLE_ERC20_DIVIDENDS_MODULE_START'
)<{
  symbol: string;
  storageWalletAddress: string;
}>();

const createCheckpointStart = createStandardAction(
  'PROCEDURES/CREATE_CHECKPOINT_START'
)<{
  symbol: string;
}>();

const updateTaxWithholdingListStart = createStandardAction(
  'PROCEDURES/UPDATE_TAX_WITHHOLDING_LIST_START'
)<{
  symbol: string;
  dividendType: DividendModuleTypes;
  investorAddresses: string[];
  percentages: number[];
}>();

const createErc20DividendDistributionStart = createStandardAction(
  'PROCEDURES/CREATE_ERC20_DIVIDEND_DISTRIBUTION_START'
)<{
  symbol: string;
  maturityDate: Date;
  expiryDate: Date;
  erc20Address: string;
  amount: BigNumber;
  checkpointId: number;
  name: string;
  excludedAddresses: string[];
  pushPaymentsWhenComplete: boolean;
}>();

const pushDividendPaymentStart = createStandardAction(
  'PROCEDURES/PUSH_DIVIDEND_PAYMENT_START'
)<{
  symbol: string;
  dividendType: DividendModuleTypes;
  dividendIndex: number;
}>();

const setDividendsWalletStart = createStandardAction(
  'PROCEDURES/SET_DIVIDENDS_WALLET_START'
)<{
  symbol: string;
  dividendType: DividendModuleTypes;
  walletAddress: string;
}>();

const withdrawDividendTaxesStart = createStandardAction(
  'PROCEDURES/WITHDRAW_DIVIDEND_TAXES_START'
)<{
  symbol: string;
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
