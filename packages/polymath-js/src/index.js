// @flow

import { Contract } from './contracts';
export {
  PolyToken,
  SecurityTokenRegistry,
  SecurityToken,
  STO,
  TransferManager,
  PermissionManager,
  PercentageTransferManager,
  CountTransferManager,
  PolymathRegistry,
} from './contracts';

export { setupContracts } from './setupContracts';
export default Contract;

export type {
  Investor,
  STOPurchase,
  STODetails,
  STOFactory,
  Address,
  SymbolDetails,
  Artifact,
  NetworkParams,
  Web3Receipt,
  Web3Contract,
  Web3Event,
  Web3,
} from './types';
