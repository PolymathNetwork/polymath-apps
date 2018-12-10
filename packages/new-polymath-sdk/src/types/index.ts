import { PolymathClient } from '~/classes';

import { types } from '@polymathnetwork/new-shared';
import { Wallet } from '~/classes/Wallet';
import BigNumber from 'bignumber.js';

export enum TransactionTypes {
  Approve,
  GetTokens,
}

export interface PolymathContext {
  polymath: PolymathClient;
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
