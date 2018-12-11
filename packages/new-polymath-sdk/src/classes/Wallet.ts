import BigNumber from 'bignumber.js';
import { v4 } from 'uuid';
import Web3 from 'web3';
import { types } from '@polymathnetwork/new-shared';
import { PolymathBaseContext } from '~/types';

interface Args {
  id?: types.Id;
  address: types.Address;
}

// TODO @RafaelVidaurre: Implement caching strategies and deduping transactions

export class Wallet implements types.Wallet {
  public id: types.Id = v4();
  public address: types.Address;
  private context: PolymathBaseContext;

  constructor({ id, address }: Args, context: PolymathBaseContext) {
    this.id = id || this.id;
    this.address = address;
    this.context = context;
  }

  public toString() {
    return this.address;
  }

  // FIXME @RafaelVidaurre:Balance is wrong
  public async getBalance(token: types.Tokens) {
    const tokenContract = this.context.getTokenContract(token);
    const balanceRes = await tokenContract.balanceOf(this.address);
    console.log('balanceRes', balanceRes);
    return new BigNumber(balanceRes);
  }

  public async getAllowance(spender: types.Address | Wallet) {
    const allowanceRes = await this.context.polyToken.allowance(
      this.address,
      `${spender}`
    );
    return new BigNumber(allowanceRes);
  }
}
