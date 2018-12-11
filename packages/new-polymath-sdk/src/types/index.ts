import BigNumber from 'bignumber.js';
import { types } from '@polymathnetwork/new-shared';
import { Wallet } from '~/classes/Wallet';
import { PolyToken } from '~/LowLevel/PolyToken';
import { PolymathRegistry } from '~/LowLevel/PolymathRegistry';
import { SecurityTokenRegistry } from '~/LowLevel/SecurityTokenRegistry';

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
