import BigNumber from 'bignumber.js';
import { HttpProvider, WebsocketProvider } from 'web3/providers';
import { PostTransactionResolver } from '~/PostTransactionResolver';
import PromiEvent from 'web3/promiEvent';
import { types } from '@polymathnetwork/new-shared';
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
  GenerateSecurityTokenArgs,
  DividendModuleTypes,
} from '~/LowLevel/types';

export { DividendModuleTypes };

export interface TaxWithholding {
  address: string;
  percentage: number;
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

export interface TransactionArguments {
  [types.PolyTransactionTags.Any]: {};
  [types.PolyTransactionTags.SetErc20TaxWithholding]: SetWithholdingArgs;
  [types.PolyTransactionTags.SetEtherTaxWithholding]: SetWithholdingArgs;
  [types.PolyTransactionTags.ReclaimDividendFunds]: ReclaimDividendArgs;
  [types.PolyTransactionTags.WithdrawTaxWithholdings]: WithdrawWithholdingArgs;
  [types.PolyTransactionTags
    .CreateErc20DividendDistribution]: CreateErc20DividendArgs;
  [types.PolyTransactionTags
    .CreateEtherDividendDistribution]: CreateEtherDividendArgs;
  [types.PolyTransactionTags.GetTokens]: GetTokensArgs;
  [types.PolyTransactionTags.Approve]: ApproveArgs;
  [types.PolyTransactionTags.EnableDividends]: AddDividendsModuleArgs;
  [types.PolyTransactionTags.ReserveSecurityToken]: RegisterTickerArgs;
  [types.PolyTransactionTags.CreateSecurityToken]: GenerateSecurityTokenArgs;
  [types.PolyTransactionTags.CreateCheckpoint]: {};
}

// Procedure arguments

export interface ApproveProcedureArgs {
  amount: BigNumber;
  spender: string;
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
  checkpointId: number;
  name: string;
  excludedAddresses?: string[];
  taxWithholdings?: TaxWithholding[];
}

export interface CreateEtherDividendDistributionProcedureArgs {
  symbol: string;
  maturityDate: Date;
  expiryDate: Date;
  amount: BigNumber;
  checkpointId: number;
  name: string;
  excludedAddresses?: string[];
  taxWithholdings?: TaxWithholding[];
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

export interface ReclaimFundsProcedureArgs {
  symbol: string;
  dividendIndex: number;
  dividendType: DividendModuleTypes;
}

export interface ReserveSecurityTokenProcedureArgs {
  symbol: string;
  name: string;
}

export interface WithdrawTaxesProcedureArgs {
  symbol: string;
  dividendIndex: number;
  dividendType: DividendModuleTypes;
}

export interface ProcedureArguments {
  [types.ProcedureTypes.Approve]: ApproveProcedureArgs;
  [types.ProcedureTypes.CreateCheckpoint]: CreateCheckpointProcedureArgs;
  [types.ProcedureTypes
    .CreateErc20DividendDistribution]: CreateErc20DividendDistributionProcedureArgs;
  [types.ProcedureTypes
    .CreateEtherDividendDistribution]: CreateEtherDividendDistributionProcedureArgs;
  [types.ProcedureTypes.CreateSecurityToken]: CreateSecurityTokenProcedureArgs;
  [types.ProcedureTypes
    .EnableDividendModules]: EnableDividendModulesProcedureArgs;
  [types.ProcedureTypes.ReclaimFunds]: ReclaimFundsProcedureArgs;
  [types.ProcedureTypes
    .ReserveSecurityToken]: ReserveSecurityTokenProcedureArgs;
  [types.ProcedureTypes.WithdrawTaxes]: WithdrawTaxesProcedureArgs;
  [types.ProcedureTypes.UnnamedProcedure]: {};
}
