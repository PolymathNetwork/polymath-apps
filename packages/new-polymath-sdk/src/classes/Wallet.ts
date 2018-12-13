import BigNumber from 'bignumber.js';
import { v4 } from 'uuid';
import { types } from '@polymathnetwork/new-shared';
import { Context } from './Context';

interface Args {
  id?: types.Id;
  address: string;
}

// TODO @RafaelVidaurre: Implement caching strategies and deduping transactions

export class Wallet implements types.Wallet {
  public id: types.Id = v4();
  public address: string;
  private context: Context;

  constructor({ id, address }: Args, context: Context) {
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
    return new BigNumber(balanceRes);
  }

  public async getAllowance(spender: string | Wallet) {
    const allowanceRes = await this.context.polyToken.allowance(
      this.address,
      `${spender}`
    );
    return new BigNumber(allowanceRes);
  }
}
