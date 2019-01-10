import BigNumber from 'bignumber.js';
import { PostTransactionResolver } from '~/PostTransactionResolver';
import PromiEvent from 'web3/promiEvent';

export interface TaxWithholding {
  address: string;
  percentage: number;
}

export enum ModuleTypes {
  Permission = 1,
  Transfer,
  Sto,
  Dividends,
  Burn,
}

export enum ErrorCodes {
  IncompatibleBrowser = 'IncompatibleBrowser',
  UserDeniedAccess = 'UserDeniedAccess',
  WalletIsLocked = 'WalletIsLocked',
  ProcedureValidationError = 'ProcedureValidationError',
  TransactionRejectedByUser = 'TransactionRejectedByUser',
  TransactionReverted = 'TransactionReverted',
  FatalError = 'FatalError',
}

export interface InvestorBalance {
  address: string;
  balance: BigNumber;
}

export type LowLevelMethod<A extends any[]> = (
  ...args: A
) => Promise<() => PromiEvent<any>>;

export interface TransactionSpec<Args extends any[]> {
  method: LowLevelMethod<Args>;
  args: Args;
  postTransactionResolver?: PostTransactionResolver<any>;
  tag?: PolyTransactionTags;
}

export enum ProcedureTypes {
  Unnamed = 'Unnamed',
  Approve = 'Approve',
  CreateErc20DividendCheckpoint = 'CreateErc20DividendCheckpoint',
  CreateEtherDividendCheckpoint = 'CreateEtherDividendCheckpoint',
  CreateSecurityToken = 'CreateSecurityToken',
  EnableDividendModules = 'EnableDividendModules',
  ReclaimFunds = 'ReclaimFunds',
  ReserveSecurityToken = 'ReserveSecurityToken',
  WithdrawTaxes = 'WithdrawTaxes',
}

export enum PolyTransactionTags {
  Any = 'Any',
  Approve = 'Approve',
  GetTokens = 'GetTokens',
  ReserveSecurityToken = 'ReserveSecurityToken',
  CreateSecurityToken = 'CreateSecurityToken',
  CreateCheckpoint = 'CreateCheckpoint',
  CreateErc20DividendDistribution = 'CreateErc20DividendDistribution',
  CreateEtherDividendDistribution = 'CreateEtherDividendDistribution',
  SetErc20TaxWithholding = 'SetErc20TaxWithholding',
  SetEtherTaxWithholding = 'SetEtherTaxWithholding',
  EnableDividends = 'EnableDividends',
  ReclaimDividendFunds = 'ReclaimDividendFunds',
  WithdrawTaxWithholdings = 'WithdrawTaxWithholdings',
}
