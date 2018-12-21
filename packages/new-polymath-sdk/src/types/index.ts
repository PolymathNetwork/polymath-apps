import { Wallet } from '~/classes/Wallet';
import BigNumber from 'bignumber.js';

export interface TaxWithholding {
  address: string;
  percentage: number;
}
export enum TransactionTypes {
  Approve,
  GetTokens,
}

export enum ModuleTypes {
  Permission = 1,
  Transfer,
  Sto,
  Dividends,
  Burn,
}

export type Addressable = Wallet | string;

export enum ErrorCodes {
  IncompatibleBrowser,
  UserDeniedAccess,
  WalletIsLocked,
}

export interface Dividend {
  checkpointId: number;
  created: Date;
  maturity: Date;
  expiry: Date;
  amount: BigNumber;
  claimedAmount: BigNumber;
  totalSupply: BigNumber;
  reclaimed: boolean;
  dividendWithheld: BigNumber;
  dividendWithheldReclaimed: BigNumber;
  name: string;
  currency: string | null;
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
