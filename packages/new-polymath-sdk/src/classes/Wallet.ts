import BigNumber from 'bignumber.js';
import { v4 } from 'uuid';
import { types } from '@polymathnetwork/new-shared';
import { Polymath } from '~/classes';

interface Params {
  id?: types.Id;
  address: types.Address;
  token: types.Tokens;
}

export class Wallet implements types.Wallet {
  public id: types.Id = v4();
  public address: types.Address;
  public balances: {
    [tokenSymbol: string]: BigNumber;
  } = {};
  private allowances: {
    [spender: string]: BigNumber;
  } = {};

  constructor({ id, address }: Params) {
    this.id = id || this.id;
    this.address = address;
  }

  public toString() {
    return this.address;
  }

  public async getBalance(token: types.Tokens) {
    const tokenContract = Polymath.getTokenContract(token);
    if (this.balances[token] === undefined) {
      const updatedBalance = await Polymath.polyToken.balanceOf(this.address);
      this.balances[token] = updatedBalance;
    }

    return this.balances[token];
  }

  public async getAllowance(spender: types.Address | Wallet) {
    if (this.allowances[`${spender}`] === undefined) {
      const updatedAllowance = await Polymath.polyToken.allowance(
        this.address,
        spender
      );
      this.allowances[`${spender}`] = updatedAllowance;
    }

    return this.allowances[`${spender}`];
  }
}
