import BigNumber from 'bignumber.js';
import { types } from '@polymathnetwork/new-shared';
import { Omit } from '@polymathnetwork/new-shared/build/dist/typing/helpers';

export interface Entity {
  uid: string;
}

export interface TransactionEntity extends Entity {
  txHash: string;
}

export interface DividendEntity extends Entity {
  index: number;
  securityTokenSymbol: string;
  securityTokenId: string;
  checkpointId: string;
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

export interface CheckpointEntity extends Entity {
  index: number;
  securityTokenSymbol: string;
  securityTokenId: string;
  investorBalances: Array<{
    address: string;
    balance: BigNumber;
  }>;
  totalSupply: BigNumber;
  createdAt: Date;
}

export interface Erc20DividendsModuleEntity extends Entity {
  /**
   * if undefined, it means the module is not attached
   */
  address?: string;
  securityTokenSymbol: string;
  securityTokenId: string;
}

export interface SequenceEntity extends Entity {}

export interface Wallet {
  address: string;
}

export interface Identity {
  email: string;
  confirmed?: boolean;
  fullName: string;
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
  Sequences = 'sequences',
}

export enum RequestKeys {
  GetCheckpointsBySymbol = 'getCheckpointsBySymbol',
  GetSecurityTokenBySymbol = 'getSecurityTokenBySymbol',
  GetDividendsByCheckpoint = 'getDividendsByCheckpoint',
  GetErc20DividendsModuleBySymbol = 'getErc20DividendsModuleBySymbol',
}

export interface GetCheckpointsBySymbolArgs {
  securityTokenSymbol: string;
}

export interface GetSecurityTokenBySymbolArgs {
  securityTokenSymbol: string;
}

export interface GetDividendsByCheckpointArgs {
  securityTokenSymbol: string;
  checkpointIndex: number;
}

export interface GetErc20DividendsModuleBySymbolArgs {
  securityTokenSymbol: string;
}

export function isGetCheckpointsBySymbolArgs(
  args: any
): args is GetCheckpointsBySymbolArgs {
  const { securityTokenSymbol } = args;

  return typeof securityTokenSymbol === 'string';
}

export function isGetSecurityTokenBySymbolArgs(
  args: any
): args is GetSecurityTokenBySymbolArgs {
  const { securityTokenSymbol } = args;

  return typeof securityTokenSymbol === 'string';
}

export function isGetDividendsByCheckpointArgs(
  args: any
): args is GetDividendsByCheckpointArgs {
  const { securityTokenSymbol, checkpointIndex } = args;

  return (
    typeof securityTokenSymbol === 'string' &&
    typeof checkpointIndex === 'number'
  );
}

export function isGetErc20DividendsModuleBySymbolArgs(
  args: any
): args is GetCheckpointsBySymbolArgs {
  const { securityTokenSymbol } = args;

  return typeof securityTokenSymbol === 'string';
}

export interface Fetcher {
  propKey?: string;
  entity: Entities;
  requestKey: RequestKeys;
  args: types.Pojo;
}

export interface FetchedData {
  [key: string]: Entity[] | null | undefined;
}

export interface CacheStatus {
  args: types.Pojo;
  requestKey: RequestKeys;
  mustBeFetched: boolean;
}

export type PartialWithId<T extends Entity> = Partial<Omit<T, 'uid'>> & {
  uid: string;
};
