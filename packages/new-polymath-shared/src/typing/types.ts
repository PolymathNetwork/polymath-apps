import BigNumber from 'bignumber.js';
import _ from 'lodash';

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
export enum SequenceStatus {
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

export function isPojo(pojo: any): pojo is Pojo {
  const props = Object.getOwnPropertyNames(pojo);

  return (
    _.every(props, prop => {
      return typeof pojo[prop] !== 'function';
    }) && _.isPlainObject(pojo)
  );
}

export interface Pojo {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | Pojo
    | BigNumber
    | Date
    | Array<string | number | boolean | null | Pojo | BigNumber | Date>;
}
