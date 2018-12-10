import BigNumber from 'bignumber.js';
import { v4 } from 'uuid';
import { types } from '@polymathnetwork/new-shared';
import { PolymathBaseContext } from '~/types';

interface Args {
  id?: types.Id;
  address: types.Address;
}

export class Wallet implements types.Wallet {
  public id: types.Id = v4();
  public address: types.Address;
  public balances: {
    [tokenSymbol: string]: BigNumber;
  } = {};
  public allowances: {
    [spender: string]: BigNumber;
  } = {};
  private context: PolymathBaseContext;

  constructor({ id, address }: Args, context: PolymathBaseContext) {
    this.id = id || this.id;
    this.address = address;
    this.context = context;
  }

  public toString() {
    return this.address;
  }

  public async getBalance(token: types.Tokens) {
    const tokenContract = this.context.getTokenContract(token);
    if (this.balances[token] === undefined) {
      const updatedBalance = await tokenContract.balanceOf(this.address);
      this.balances[token] = updatedBalance;
    }

    return this.balances[token];
  }

  public async getAllowance(spender: types.Address | Wallet) {
    if (this.allowances[`${spender}`] === undefined) {
      const updatedAllowance = await this.context.polyToken.allowance(
        `${spender}`
      );
      this.allowances[`${spender}`] = updatedAllowance;
    }

    return this.allowances[`${spender}`];
  }
}
