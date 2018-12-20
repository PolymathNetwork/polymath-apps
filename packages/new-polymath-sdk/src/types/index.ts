import { Contract } from '~/LowLevel/Contract';
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

export interface TransactionSpec<Args extends any[]> {
  method: (...args: Args) => Promise<any>;
  args: Args;
  contract: Contract<any>;
  postTransactionResolver: PostTransactionResolver<any>;
}
