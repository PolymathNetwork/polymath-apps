import BigNumber from 'bignumber.js';
import { HttpProvider, WebsocketProvider } from 'web3/providers';
import PromiEvent from 'web3/promiEvent';
import { isPlainObject } from 'lodash';
import { PostTransactionResolver } from '../PostTransactionResolver';
import {
  SetWithholdingArgs,
  ReclaimDividendArgs,
  WithdrawWithholdingArgs,
  CreateErc20DividendArgs,
  CreateEtherDividendArgs,
  GetTokensArgs,
  ApproveArgs,
  AddDividendsModuleArgs,
  RegisterTickerArgs,
  GenerateNewSecurityTokenArgs,
  PushDividendPaymentArgs,
  DividendInvestorStatus,
  SetDividendsWalletArgs,
} from '../LowLevel/types';

// TODO @RafaelVidaurre: This type should come from LowLevel. Duplicating it
// for now because of compilation issues
export interface DividendInvestorStatus {
  address: string;
  paymentReceived: boolean;
  excluded: boolean;
  withheldTax: BigNumber;
  amountReceived: BigNumber;
  balance: BigNumber;
}

// TODO @RafaelVidaurre: This type should come from LowLevel. Duplicating it
// for now because of compilation issues
export enum DividendModuleTypes {
  Erc20 = 'erc20',
  Eth = 'eth',
}

export function isDividendModuleTypes(type: any): type is DividendModuleTypes {
  return (
    typeof type === 'string' &&
    (type === DividendModuleTypes.Erc20 || type === DividendModuleTypes.Eth)
  );
}

// TODO @RafaelVidaurre: This type should come from LowLevel. Duplicating it
// for now because of compilation issues
export enum StoModuleTypes {
  Capped = 'capped',
  UsdTiered = 'usdTiered',
}

export function isStoModuleTypes(type: any): type is StoModuleTypes {
  return (
    typeof type === 'string' &&
    (type === StoModuleTypes.UsdTiered || type === StoModuleTypes.Capped)
  );
}

export interface TaxWithholdingEntry {
  address: string;
  percentage: number;
}

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

export interface InvestorBalance {
  address: string;
  balance: BigNumber;
}

export type LowLevelMethod<A> = (args: A) => Promise<() => PromiEvent<any>>;

export interface TransactionSpec<Args = any, R = any> {
  method: LowLevelMethod<Args>;
  args: MapMaybeResolver<Args>;
  postTransactionResolver?: PostTransactionResolver<R>;
  tag?: PolyTransactionTags;
}

export interface PolymathNetworkParams {
  httpProvider?: HttpProvider;
  httpProviderUrl?: string;
  wsProvider?: WebsocketProvider;
  wsProviderUrl?: string;
  polymathRegistryAddress: string;
  privateKey?: string;
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

export type MaybeResolver<T> = PostTransactionResolver<T> | T;

export type MapMaybeResolver<T> = { [K in keyof T]: MaybeResolver<T[K]> };

export interface TransactionArguments {
  [PolyTransactionTags.Any]: {};
  [PolyTransactionTags.SetErc20TaxWithholding]: Partial<SetWithholdingArgs>;
  [PolyTransactionTags.SetEtherTaxWithholding]: Partial<SetWithholdingArgs>;
  [PolyTransactionTags.ReclaimDividendFunds]: Partial<ReclaimDividendArgs>;
  [PolyTransactionTags.WithdrawTaxWithholdings]: Partial<WithdrawWithholdingArgs>;
  [PolyTransactionTags.CreateErc20DividendDistribution]: Partial<CreateErc20DividendArgs>;
  [PolyTransactionTags.CreateEtherDividendDistribution]: Partial<CreateEtherDividendArgs>;
  [PolyTransactionTags.GetTokens]: Partial<GetTokensArgs>;
  [PolyTransactionTags.Approve]: Partial<ApproveArgs>;
  [PolyTransactionTags.EnableDividends]: Partial<AddDividendsModuleArgs>;
  [PolyTransactionTags.ReserveSecurityToken]: Partial<RegisterTickerArgs>;
  [PolyTransactionTags.CreateSecurityToken]: Partial<GenerateNewSecurityTokenArgs>;
  [PolyTransactionTags.PushDividendPayment]: Partial<PushDividendPaymentArgs>;
  [PolyTransactionTags.SetDividendsWallet]: Partial<SetDividendsWalletArgs>;
  [PolyTransactionTags.CreateCheckpoint]: {};
}

// Procedure arguments

export interface ApproveProcedureArgs {
  amount: BigNumber;
  spender: string;
  tokenAddress?: string;
  owner?: string;
}

export interface CreateCheckpointProcedureArgs {
  symbol: string;
}

export interface CreateErc20DividendDistributionProcedureArgs {
  symbol: string;
  maturityDate: Date;
  expiryDate: Date;
  erc20Address: string;
  amount: BigNumber;
  checkpointIndex: number;
  name: string;
  excludedAddresses?: string[];
  taxWithholdings?: TaxWithholdingEntry[];
}

export interface CreateEtherDividendDistributionProcedureArgs {
  symbol: string;
  maturityDate: Date;
  expiryDate: Date;
  amount: BigNumber;
  checkpointIndex: number;
  name: string;
  excludedAddresses?: string[];
  taxWithholdings?: TaxWithholdingEntry[];
}

export interface PushDividendPaymentProcedureArgs {
  symbol: string;
  dividendIndex: number;
  dividendType: DividendModuleTypes;
  investorAddresses?: string[];
}

export interface CreateSecurityTokenProcedureArgs {
  name: string;
  symbol: string;
  detailsUrl?: string;
  divisible: boolean;
}

export interface EnableDividendModulesProcedureArgs {
  symbol: string;
  storageWalletAddress: string;
  types?: DividendModuleTypes[];
}

export interface EnableGeneralPermissionManagerProcedureArgs {
  symbol: string;
}

export interface ReclaimFundsProcedureArgs {
  symbol: string;
  dividendIndex: number;
  dividendType: DividendModuleTypes;
}

export interface ReserveSecurityTokenProcedureArgs {
  symbol: string;
  name: string;
  owner?: string;
}

export interface WithdrawTaxesProcedureArgs {
  symbol: string;
  dividendIndex: number;
  dividendType: DividendModuleTypes;
}

export interface UpdateDividendsTaxWithholdingListProcedureArgs {
  symbol: string;
  dividendType: DividendModuleTypes;
  investorAddresses: string[];
  percentages: number[];
}

export interface SetDividendsWalletProcedureArgs {
  symbol: string;
  dividendType: DividendModuleTypes;
  address: string;
}

export interface ChangeDelegatePermissionArgs {
  symbol: string;
  delegate: string;
  op: ModuleOperations;
  isGranted: boolean;
  details?: string;
}

export interface ControllerTransferArgs {
  from: string;
  to: string;
  symbol: string;
  value: BigNumber;
  data?: string;
  log?: string;
}

export interface PauseStoArgs {
  symbol: string;
  stoModuleAddress: string;
}

export interface SetControllerArgs {
  symbol: string;
  controller: string;
}

export interface ProcedureArguments {
  [ProcedureTypes.Approve]: ApproveProcedureArgs;
  [ProcedureTypes.CreateCheckpoint]: CreateCheckpointProcedureArgs;
  [ProcedureTypes.CreateErc20DividendDistribution]: CreateErc20DividendDistributionProcedureArgs;
  [ProcedureTypes.CreateEtherDividendDistribution]: CreateEtherDividendDistributionProcedureArgs;
  [ProcedureTypes.CreateSecurityToken]: CreateSecurityTokenProcedureArgs;
  [ProcedureTypes.EnableDividendModules]: EnableDividendModulesProcedureArgs;
  [ProcedureTypes.ReclaimFunds]: ReclaimFundsProcedureArgs;
  [ProcedureTypes.ReserveSecurityToken]: ReserveSecurityTokenProcedureArgs;
  [ProcedureTypes.WithdrawTaxes]: WithdrawTaxesProcedureArgs;
  [ProcedureTypes.UpdateDividendsTaxWithholdingList]: UpdateDividendsTaxWithholdingListProcedureArgs;
  [ProcedureTypes.PushDividendPayment]: PushDividendPaymentProcedureArgs;
  [ProcedureTypes.SetDividendsWallet]: SetDividendsWalletProcedureArgs;
  [ProcedureTypes.UnnamedProcedure]: {};
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

export enum ModuleOperations {
  // MODULE_COMPONENT_OP
  GTM_WHITELIST_UPDATE = 'GTM_WHITELIST_UPDATE',
}

export enum ModulePermissions {
  Whitelist = 'WHITELIST',
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

export function isPojo(pojo: any): pojo is Pojo {
  if (!pojo) {
    return false;
  }

  const props = Object.getOwnPropertyNames(pojo);

  return (
    props.every(prop => {
      return typeof pojo[prop] !== 'function';
    }) && isPlainObject(pojo)
  );
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
