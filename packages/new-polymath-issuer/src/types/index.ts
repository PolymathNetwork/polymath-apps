import { types } from '@polymathnetwork/new-shared';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { DividendModuleTypes } from '@polymathnetwork/sdk';
import { includes } from 'lodash';

export interface Wallet {
  address: string;
}

export interface Identity {
  email: string;
  confirmed?: boolean;
  fullName: string;
}

export enum QueueStatus {
  Canceled = 'canceled',
  Failed = 'failed',
  Succeeded = 'succeeded',
  Empty = 'empty',
}

export enum SessionRoles {
  Anonymous,
  LoggedIn,
  UnconfirmedUser,
  ConfirmedUser,
}

export enum Entities {
  Checkpoints = 'checkpoints',
  Transactions = 'transactions',
  Dividends = 'dividends',
  Erc20DividendsModules = 'erc20DividendsModules',
  TransactionQueues = 'transactionQueues',
  TaxWithholdings = 'taxWithholdings',
  Erc20TokenBalances = 'erc20TokenBalances',
}

export enum RequestKeys {
  GetCheckpointsBySymbol = 'getCheckpointsBySymbol',
  GetSecurityTokenBySymbol = 'getSecurityTokenBySymbol',
  GetDividendsByCheckpoint = 'getDividendsByCheckpoint',
  GetDividendBySymbolAndId = 'getDividendBySymbolAndId',
  GetCheckpointBySymbolAndId = 'getCheckpointBySymbolAndId',
  GetErc20DividendsModuleBySymbol = 'getErc20DividendsModuleBySymbol',
  GetTaxWithholdingListBySymbolAndCheckpoint = 'getTaxWithholdingListBySymbolAndCheckpoint',
  GetErc20BalanceByAddressAndWallet = 'getErc20BalanceByAddressAndWallet',
}

export interface GetCheckpointsBySymbolArgs {
  symbol: string;
}

export interface GetCheckpointBySymbolAndIdArgs {
  symbol: string;
  checkpointId: number;
}

export interface GetSecurityTokenBySymbolArgs {
  symbol: string;
}

export interface GetDividendsByCheckpointArgs {
  symbol: string;
  checkpointId: number;
}

export interface GetDividendBySymbolAndIdArgs {
  symbol: string;
  dividendIndex: number;
  dividendType: DividendModuleTypes;
}

export interface GetErc20DividendsModuleBySymbolArgs {
  symbol: string;
}

export interface GetTaxWithholdingListBySymbolAndCheckpointArgs {
  symbol: string;
  checkpointId: number;
  dividendType: DividendModuleTypes;
}

export interface GetErc20BalanceByAddressAndWalletArgs {
  tokenAddress: string;
  walletAddress: string;
}

export interface GetIsValidErc20ByAddressArgs {
  tokenAddress: string;
}

export type RequestArgs =
  | GetCheckpointBySymbolAndIdArgs
  | GetCheckpointsBySymbolArgs
  | GetSecurityTokenBySymbolArgs
  | GetDividendBySymbolAndIdArgs
  | GetDividendsByCheckpointArgs
  | GetErc20DividendsModuleBySymbolArgs
  | GetTaxWithholdingListBySymbolAndCheckpointArgs
  | GetErc20BalanceByAddressAndWalletArgs
  | GetIsValidErc20ByAddressArgs;

export function isGetCheckpointsBySymbolArgs(
  args: any
): args is GetCheckpointsBySymbolArgs {
  const { symbol } = args;

  return typeof symbol === 'string';
}

export function isGetCheckpointBySymbolAndIdArgs(
  args: any
): args is GetCheckpointBySymbolAndIdArgs {
  const { symbol, checkpointId } = args;

  return (
    typeof symbol === 'string' &&
    typeof checkpointId === 'number'
  );
}

export function isGetSecurityTokenBySymbolArgs(
  args: any
): args is GetSecurityTokenBySymbolArgs {
  const { symbol } = args;

  return typeof symbol === 'string';
}

export function isGetDividendsByCheckpointArgs(
  args: any
): args is GetDividendsByCheckpointArgs {
  const { symbol, checkpointId } = args;

  return (
    typeof symbol === 'string' &&
    typeof checkpointId === 'number'
  );
}

export function isGetDividendBySymbolAndIdArgs(
  args: any
): args is GetDividendBySymbolAndIdArgs {
  const { symbol, dividendIndex, dividendType } = args;

  return (
    typeof symbol === 'string' &&
    typeof dividendIndex === 'number' &&
    typeof dividendType === 'string' &&
    includes([DividendModuleTypes.Erc20, DividendModuleTypes.Eth], dividendType)
  );
}

export function isGetErc20DividendsModuleBySymbolArgs(
  args: any
): args is GetCheckpointsBySymbolArgs {
  const { symbol } = args;

  return typeof symbol === 'string';
}

export function isGetTaxWithholdingListBySymbolAndCheckpointArgs(
  args: any
): args is GetTaxWithholdingListBySymbolAndCheckpointArgs {
  const { symbol, checkpointId, dividendType } = args;

  return (
    typeof symbol === 'string' &&
    typeof checkpointId === 'number' &&
    typeof dividendType === 'string' &&
    (dividendType === DividendModuleTypes.Erc20 ||
      dividendType === DividendModuleTypes.Eth)
  );
}

export function isGetErc20BalanceByAddressAndWalletArgs(
  args: any
): args is GetErc20BalanceByAddressAndWalletArgs {
  const { tokenAddress, walletAddress } = args;

  return typeof tokenAddress === 'string' && typeof walletAddress === 'string';
}

export function isGetIsValidErc20TokenBalanceByAddressArgs(
  args: any
): args is GetIsValidErc20ByAddressArgs {
  const { tokenAddress } = args;

  return typeof tokenAddress === 'string';
}

export interface Fetcher<Args extends {}> {
  propKey?: string;
  entity: Entities;
  requestKey: RequestKeys;
  args: Args;
}

export interface FetchedData {
  [key: string]: types.Entity[] | null | undefined;
}

export interface CacheStatus {
  args: RequestArgs;
  requestKey: RequestKeys;
  mustBeFetched: boolean;
}

export type PartialWithId<T extends types.Entity> = Partial<
  typeHelpers.Omit<T, 'uid'>
> & {
  uid: string;
};

export interface TransactionQueueResult<T = any> {
  queueStatus: QueueStatus;
  result?: T;
}
