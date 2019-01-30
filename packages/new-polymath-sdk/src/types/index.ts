import BigNumber from 'bignumber.js';
import { HttpProvider, WebsocketProvider } from 'web3/providers';
import { PostTransactionResolver } from '~/PostTransactionResolver';
import PromiEvent from 'web3/promiEvent';
import { types } from '@polymathnetwork/new-shared';

export { DividendModuleTypes } from '~/LowLevel/types';

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

export interface TransactionSpec<Args = any, R = any> {
  method: LowLevelMethod<any>;
  args: MapMaybeResolver<Args>;
  postTransactionResolver?: PostTransactionResolver<R>;
  tag?: types.PolyTransactionTags;
}

export interface PolymathNetworkParams {
  httpProvider?: HttpProvider;
  httpProviderUrl?: string;
  wsProvider?: WebsocketProvider;
  wsProviderUrl?: string;
  polymathRegistryAddress: string;
}

export type MapMaybeResolver<T> = {
  [K in keyof T]: PostTransactionResolver<T[K]> | T[K]
};
