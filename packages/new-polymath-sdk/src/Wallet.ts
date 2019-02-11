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

  public async getBalance(token: types.Tokens) {
    const {
      context: { getTokenContract },
      address,
    } = this;
    const tokenContract = getTokenContract(token);
    const balanceRes = await tokenContract.balanceOf({ address });
    return new BigNumber(balanceRes);
  }

  public async getAllowance(spender: string | Wallet) {
    const {
      context: {
        polyToken: { allowance },
      },
      address,
    } = this;
    const allowanceRes = await allowance({
      tokenOwner: address,
      spender: `${spender}`,
    });
    return new BigNumber(allowanceRes);
  }

  public toString() {
    return this.address;
  }
}
