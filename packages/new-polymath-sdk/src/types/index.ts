import BigNumber from 'bignumber.js';
import { Contract } from '~/LowLevel/Contract';
import { PostTransactionResolver } from '~/PostTransactionResolver';
import { Dividend } from '~/LowLevel/types';

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

export interface Checkpoint {
  dividends: Dividend[];
  id: number;
  investorBalances: InvestorBalance[];
  totalSupply: BigNumber;
  createdAt: Date;
}

export interface TransactionSpec<Args extends any[]> {
  method: (...args: Args) => Promise<any>;
  args: Args;
  contract: Contract<any>;
  postTransactionResolver: PostTransactionResolver<any>;
}
