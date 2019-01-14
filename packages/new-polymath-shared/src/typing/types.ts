import BigNumber from 'bignumber.js';
import _ from 'lodash';
import { TransactionReceipt } from 'web3/types';
import { typeHelpers } from '~/index';

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
  transactionQueueUid: string;
  status: TransactionStatus;
  tag: PolyTransactionTags;
  description: string;
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
  description: string;
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
