import BigNumber from 'bignumber.js';

export enum Tokens {
  Poly = 'POLY',
  Dai = 'DAI',
  Ether = 'ETH',
  Erc20 = 'ERC20',
}

export enum TransactionStatus {
  Idle = 'IDLE',
  Unapproved = 'UNAPPROVED',
  Running = 'RUNNING',
  Rejected = 'REJECTED',
  Succeeded = 'SUCCEEDED',
  Failed = 'FAILED',
}
export enum HigherLevelTransactionStatus {
  Idle = 'IDLE',
  Running = 'RUNNING',
  Failed = 'FAILED',
  Succeeded = 'SUCCEEDED',
}

export type Id = string;
export type Address = string;
export type TransactionHash = string;

export interface Transaction {
  id: Id;
  status: TransactionStatus;
  type: string;
  hash?: TransactionHash;
  error?: {
    message: string;
  };
}
export interface HigherLevelTransaction {
  id: Id;
  status: HigherLevelTransactionStatus;
  name: string;
  transactions: Transaction[];
  error?: {
    message: string;
  };
}
export interface SecurityToken {
  id: Id;
  address: Address;
  symbol: string;
}
export interface Wallet {
  id: Id;
  address: Address;
  identity?: Identity;
  balance?: BigNumber;
}
export interface Identity {
  id: Id;
  name: string;
  email: string;
  confirmed?: boolean;
}
