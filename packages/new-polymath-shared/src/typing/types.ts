import BigNumber from 'bignumber.js';
import _ from 'lodash';
import { TransactionReceipt } from 'web3/types';

export enum Tokens {
  Poly = 'POLY',
  Dai = 'DAI',
  Ether = 'ETH',
  Erc20 = 'ERC20',
}

enum ErrorCodes {
  IncompatibleBrowser = 'IncompatibleBrowser',
  UserDeniedAccess = 'UserDeniedAccess',
  WalletIsLocked = 'WalletIsLocked',
  ProcedureValidationError = 'ProcedureValidationError',
  TransactionRejectedByUser = 'TransactionRejectedByUser',
  TransactionReverted = 'TransactionReverted',
  FatalError = 'FatalError',
}

interface PolymathError {
  code: ErrorCodes;
}

export enum PolyTransactionTags {
  Any = 'Any',
  Approve = 'Approve',
  GetTokens = 'GetTokens',
  ReserveSecurityToken = 'ReserveSecurityToken',
  CreateSecurityToken = 'CreateSecurityToken',
  CreateCheckpoint = 'CreateCheckpoint',
  CreateErc20DividendDistribution = 'CreateErc20DividendDistribution',
  CreateEtherDividendDistribution = 'CreateEtherDividendDistribution',
  SetErc20TaxWithholding = 'SetErc20TaxWithholding',
  SetEtherTaxWithholding = 'SetEtherTaxWithholding',
  EnableDividends = 'EnableDividends',
  ReclaimDividendFunds = 'ReclaimDividendFunds',
  WithdrawTaxWithholdings = 'WithdrawTaxWithholdings',
}

export enum TransactionStatus {
  Idle = 'IDLE',
  Unapproved = 'UNAPPROVED',
  Running = 'RUNNING',
  Rejected = 'REJECTED',
  Succeeded = 'SUCCEEDED',
  Failed = 'FAILED',
}
export enum TransactionQueueStatus {
  Idle = 'IDLE',
  Running = 'RUNNING',
  Failed = 'FAILED',
  Succeeded = 'SUCCEEDED',
}

export type Id = string;
export type Address = string;
export type TransactionHash = string;

export interface Entity {
  uid: string;
}

export interface TransactionEntity extends Entity {
  txHash?: string;
  transactionQueueUid?: string;
  status: TransactionStatus;
  tag: PolyTransactionTags;
  receipt?: TransactionReceipt;
  error?: PolymathError;
  args: any[];
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

export interface TransactionQueueEntity extends Entity {
  status: TransactionQueueStatus;
  procedureType: string;
}

export interface Transaction {
  uid: Id;
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
