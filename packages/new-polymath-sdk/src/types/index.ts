import { PolymathClient } from '~/classes';

import { types } from '@polymathnetwork/new-shared';
import { Wallet } from '~/classes/Wallet';
import BigNumber from 'bignumber.js';
import { PolyToken } from '~/lowLevel/PolyToken';
import { PolymathRegistry } from '~/lowLevel/PolymathRegistry';
import { SecurityTokenRegistry } from '~/lowLevel/SecurityTokenRegistry';

export enum TransactionTypes {
  Approve,
  GetTokens,
}

export interface PolymathBaseContext {
  polyToken: PolyToken;
  polymathRegistry: PolymathRegistry;
  securityTokenRegistry: SecurityTokenRegistry;
  isTestnet: boolean;
  getTokenContract(token: types.Tokens): PolyToken; // FIXME @RafaelVidaurre: Use token type here
}

export interface PolymathContext extends PolymathBaseContext {
  currentWallet: Wallet;
}

export interface TransactionObject<T> {
  call(): Promise<T>;
}

export type Addressable = Wallet | types.Address;
export interface Erc20 {
  address: types.Address;
  approve(spender: types.Address, amount: BigNumber): Promise<boolean>;
  allowance(
    tokenOwner: types.Address,
    spender: types.Address
  ): Promise<BigNumber>;
  balanceOf(address: types.Address): Promise<BigNumber>;
  transfer(to: types.Address, amount: BigNumber): Promise<boolean>;
}
