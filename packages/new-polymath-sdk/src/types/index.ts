import { types } from '@polymathnetwork/new-shared';
import { Wallet } from '~/classes/Wallet';
import { PolyToken } from '~/LowLevel/PolyToken';
import { PolymathRegistry } from '~/LowLevel/PolymathRegistry';
import { SecurityTokenRegistry } from '~/LowLevel/SecurityTokenRegistry';

export enum TransactionTypes {
  Approve,
  GetTokens,
}

export enum ModuleTypes {
  Permission = 1,
  Transfer,
  Sto,
  Dividends,
  Burn,
}

export type Addressable = Wallet | string;

export enum ErrorCodes {
  IncompatibleBrowser,
  UserDeniedAccess,
}
