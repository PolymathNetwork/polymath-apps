import { types } from '@polymathnetwork/new-shared';
import { Wallet } from '~/classes/Wallet';
import { PolyToken } from '~/LowLevel/PolyToken';
import { PolymathRegistry } from '~/LowLevel/PolymathRegistry';
import { SecurityTokenRegistry } from '~/LowLevel/SecurityTokenRegistry';

export enum TransactionTypes {
  Approve,
  GetTokens,
}

export type Addressable = Wallet | string;
