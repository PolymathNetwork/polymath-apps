// @flow
import USDTieredSTOFactoryArtifacts from '@polymathnetwork/polymath-scripts/fixtures/contracts/USDTieredSTOFactory.json';
import CappedSTOFactoryArtifacts from '@polymathnetwork/polymath-scripts/fixtures/contracts/CappedSTOFactory.json';

import type { BigNumber } from 'bignumber.js';

export const EVENT_TYPES = {
  TOKEN_PURCHASE: 'TokenPurchase',
};

export const MODULE_TYPES = {
  PERMISSION: 1,
  TRANSFER: 2,
  STO: 3,
  DIVIDEND: 4,
  BURN: 5,
};
export const FUND_RAISE_TYPES = {
  ETH: 0,
  POLY: 1,
  DAI: 2,
};

export const ModuleFactoryAbisByType: { [type: STOModuleType]: Object } = {
  USDTieredSTO: USDTieredSTOFactoryArtifacts.abi,
  CappedSTO: CappedSTOFactoryArtifacts.abi,
};

export const SECURITY_AUDIT_URL =
  'https://github.com/PolymathNetwork/polymath-core/blob/master/audit%20reports/' +
  'Polymath%20Core%202.0.0%20Audit%20Report%20.pdf';

export type STOModuleType = 'USDTieredSTO' | 'CappedSTO';
export type STOModule = {|
  type: STOModuleType,
  title: string,
  ownerAddress: string,
  description: string,
  setupCost: number,
  address: string,
|};
export type SecurityToken = {|
  ticker: string,
  name: string,
  owner: string,
  expires: ?Date,
  timestamp: Date,
  txHash: string,
  address: string,
  isDivisible?: boolean,
  details?: string,
  contract?: any,
|};
export type STOConfig = {|
  data: { [prop: string]: any },
|};
export type FundRaiseType = $Keys<typeof FUND_RAISE_TYPES>;
export type USDTieredSTOTierStatus = 'done' | 'active' | 'not-started';
export type USDTieredSTOTier = {|
  rate: BigNumber,
  tokensSold: BigNumber,
  totalTokens: BigNumber,
  totalUsd: BigNumber,
  usdRaised: BigNumber,
  status: USDTieredSTOTierStatus,
|};
export type USDTieredSTO = {|
  // NOTE @RafaelVidaurre: pauseStatus instead of "pause" because of legacy compat
  pauseStatus: boolean,
  isOpen: boolean,
  startDate: Date,
  endDate: Date,
  tiers: USDTieredSTOTier[],
  totalTokensSold: BigNumber,
  totalUsdRaised: BigNumber,
  factoryAddress: string,
  address: string,
  currentTier: number,
  type: 'USDTieredSTO',
  isTerminated: boolean,
  capReached: boolean,
|};

export const SENTRY_KEY =
  'https://a7bdca90b57b497a86b7c5a737344856@sentry.io/1326137';
