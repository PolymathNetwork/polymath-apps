import BigNumber from 'bignumber.js';
import { types } from '@polymathnetwork/new-shared';
import { Context } from '~/Context';

interface Args {
  address: string;
}

// TODO @RafaelVidaurre: Implement caching strategies and dedupe-ing transactions
export class Wallet {
  public address: string;
  private context: Context;

  constructor({ address }: Args, context: Context) {
    this.address = address;
    this.context = context;
  }

  public toString() {
    return this.address;
  }

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
