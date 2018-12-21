import BigNumber from 'bignumber.js';

export type Entity = TransactionEntity | DividendEntity | CheckpointEntity;

export interface TransactionEntity {
  id: string;
  txHash: string;
}

export interface DividendEntity {
  id: string;
  index: number;
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
  currency: string;
}

export interface CheckpointEntity {
  id: string;
  index: number;
  securityTokenId: string;
  investorBalances: Array<{
    address: string;
    balance: BigNumber;
  }>;
  totalSupply: BigNumber;
  createdAt: Date;
}

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
}

export enum RequestKeys {
  GetCheckpointsBySymbol = 'getCheckpointsBySymbol',
}

export interface Fetcher {
  propKey?: string;
  entity: Entities;
  requestKey: RequestKeys;
  args: Pojo;
}

export interface Pojo {
  [key: string]: string | number | boolean;
}

export interface FetchedData {
  [key: string]: Entity[] | null | undefined;
}

export interface CacheStatus {
  args: Pojo;
  requestKey: RequestKeys;
  mustBeFetched: boolean;
}
