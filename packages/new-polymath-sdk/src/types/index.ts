import BigNumber from 'bignumber.js';
import { PostTransactionResolver } from '~/PostTransactionResolver';

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
  IncompatibleBrowser,
  UserDeniedAccess,
  WalletIsLocked,
}

export interface InvestorBalance {
  address: string;
  balance: BigNumber;
}

export interface TransactionSpec<Args extends any[]> {
  method: (...args: Args) => Promise<any>;
  args: Args;
  postTransactionResolver: PostTransactionResolver<any>;
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
