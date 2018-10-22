// @flow
import USDTieredSTOFactoryArtifacts from '@polymathnetwork/shared/fixtures/contracts/USDTieredSTOFactory.json';
import CappedSTOFactoryArtifacts from '@polymathnetwork/shared/fixtures/contracts/CappedSTOFactory.json';

export const MODULE_TYPES = {
  PERMISSION: 1,
  TRANSFER: 2,
  STO: 3,
  DIVIDEND: 4,
  BURN: 5,
};

export const ModuleFactoryAbisByType: { [type: STOModuleType]: Object } = {
  USDTieredSTO: USDTieredSTOFactoryArtifacts.abi,
  CappedSTO: CappedSTOFactoryArtifacts.abi,
};

export const SECURITY_AUDIT_URL =
  'https://github.com/PolymathNetwork/polymath-core/blob/master/audit%20reports/' +
  'Polymath%20Audit%20Report%20Final.pdf';

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
