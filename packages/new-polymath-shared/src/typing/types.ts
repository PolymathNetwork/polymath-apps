import BigNumber from 'bignumber.js';
import _ from 'lodash';
import { TransactionReceipt } from 'web3/types';

export enum ErrorCodes {
  IncompatibleBrowser = 'IncompatibleBrowser',
  UserDeniedAccess = 'UserDeniedAccess',
  WalletIsLocked = 'WalletIsLocked',
  ProcedureValidationError = 'ProcedureValidationError',
  FetcherValidationError = 'FetcherValidationError',
  TransactionRejectedByUser = 'TransactionRejectedByUser',
  TransactionReverted = 'TransactionReverted',
  FatalError = 'FatalError',
  UnexpectedReturnData = 'UnexpectedReturnData',
  InvalidAddress = 'InvalidAddress',
  InsufficientBalance = 'InsufficientBalance',
}

interface Error {
  stack?: string;
}

export const ErrorMessagesPerCode: {
  [errorCode: string]: string;
} = {
  [ErrorCodes.IncompatibleBrowser]:
    'The browser bring used is not compatible with Ethereum',
  [ErrorCodes.WalletIsLocked]:
    'The wallet is locked, if Metamask extension is being used, the user needs to unlock it first',
  [ErrorCodes.UserDeniedAccess]: 'The user denied access',
  [ErrorCodes.TransactionRejectedByUser]: 'The user rejected the transaction',
  [ErrorCodes.UnexpectedReturnData]:
    'The data returned by the smart contract has an unexpected format. Please report this issue to the Polymath team',
  [ErrorCodes.InvalidAddress]: 'Invalid Address',
};

export class PolymathError extends Error {
  public code: ErrorCodes;

  constructor({ message, code }: { message?: string; code: ErrorCodes }) {
    super(
      message || ErrorMessagesPerCode[code] || `Unknown error, code: ${code}`
    );
    // eslint:disable-next-line
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Object.setPrototypeOf(this, PolymathError);

    this.code = code;
  }
}

export enum ProcedureTypes {
  UnnamedProcedure = 'UnnamedProcedure',
  Approve = 'Approve',
  CreateCheckpoint = 'CreateCheckpoint',
  EnableDividendModules = 'EnableDividendModules',
  EnableGeneralPermissionManager = 'EnableGeneralPermissionManager',
  CreateErc20DividendDistribution = 'CreateErc20DividendDistribution',
  CreateEtherDividendDistribution = 'CreateEtherDividendDistribution',
  CreateSecurityToken = 'CreateSecurityToken',
  ReclaimFunds = 'ReclaimFunds',
  ReserveSecurityToken = 'ReserveSecurityToken',
  WithdrawTaxes = 'WithdrawTaxes',
  UpdateDividendsTaxWithholdingList = 'UpdateDividendsTaxWithholdingList',
  SetDividendsWallet = 'SetDividendsWallet',
  PushDividendPayment = 'PushDividendPayment',
  ChangeDelegatePermission = 'ChangeDelegatePermission',
  ControllerTransfer = 'ControllerTransfer',
  PauseSto = 'PauseSto',
  SetController = 'SetController',
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
  EnableGeneralPermissionManager = 'EnableGeneralPermissionManager',
  ReclaimDividendFunds = 'ReclaimDividendFunds',
  WithdrawTaxWithholdings = 'WithdrawTaxWithholdings',
  PushDividendPayment = 'PushDividendPayment',
  SetDividendsWallet = 'SetDividendsWallet',
  ChangeDelegatePermission = 'ChangeDelegatePermission',
  ControllerTransfer = 'ControllerTransfer',
  PauseSto = 'PauseSto',
  SetController = 'SetController',
}

export enum Tokens {
  Poly = 'POLY',
  Dai = 'DAI',
  Ether = 'ETH',
  Erc20 = 'ERC20',
  Gusd = 'GUSD',
  Pax = 'PAX',
  Usdc = 'USDC',
  Usdt = 'USDT',
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
  receipt?: TransactionReceipt;
  error?: PolymathError;
  args: any;
}

export interface TransactionPojo extends TransactionEntity {}

export interface DividendInvestorStatus {
  address: string;
  paymentReceived: boolean;
  excluded: boolean;
  withheldTax: BigNumber;
  amountReceived: BigNumber;
  balance: BigNumber;
}

export interface DividendEntity extends Entity {
  index: number;
  symbol: string;
  checkpointId: number;
  dividendType: DividendModuleTypes;
  created: Date;
  maturity: Date;
  expiry: Date;
  amount: BigNumber;
  claimedAmount: BigNumber;
  totalSupply: BigNumber;
  reclaimed: boolean;
  totalWithheld: BigNumber;
  totalWithheldWithdrawn: BigNumber;
  investors: DividendInvestorStatus[];
  name: string;
  currency: string | null;
}

export interface DividendPojo extends DividendEntity {}

export interface CheckpointEntity extends Entity {
  index: number;
  symbol: string;
  investorBalances: Array<{
    address: string;
    balance: BigNumber;
  }>;
  totalSupply: BigNumber;
  createdAt: Date;
}

export interface CheckpointPojo extends CheckpointEntity {
  dividends: DividendPojo[];
}

export interface Erc20DividendsModuleEntity extends Entity {
  address: string;
  symbol: string;
  storageWalletAddress: string;
}

export interface Erc20DividendsModulePojo extends Erc20DividendsModuleEntity {}

export enum DividendModuleTypes {
  Erc20 = 'erc20',
  Eth = 'eth',
}

export interface TaxWithholdingEntity extends Entity {
  symbol: string;
  dividendType: DividendModuleTypes;
  investorAddress: string;
  percentage: number;
}

export interface TaxWithholdingPojo extends TaxWithholdingEntity {}

export interface TransactionQueueEntity extends Entity {
  status: TransactionQueueStatus;
  procedureType: ProcedureTypes;
  args: any;
}

export interface TransactionQueuePojo extends TransactionQueueEntity {
  transactions: TransactionPojo[];
}

export interface Erc20TokenBalanceEntity extends Entity {
  tokenSymbol: string | null;
  tokenAddress: string;
  balance: BigNumber;
}

export interface Erc20TokenBalancePojo extends Erc20TokenBalanceEntity {}

export function isPojo(pojo: any): pojo is Pojo {
  if (!pojo) {
    return false;
  }

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
