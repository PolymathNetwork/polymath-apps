import { Wallet } from '~/classes/Wallet';

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
