import BigNumber from 'bignumber.js';
import { v4 } from 'uuid';
import { types } from '@polymathnetwork/new-shared';
import { PolymathContext } from '~/types';

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
  private allowances: {
    [spender: string]: BigNumber;
  } = {};
  private polymath: PolymathContext['polymath'];

  constructor({ id, address }: Args, context: PolymathContext) {
    this.id = id || this.id;
    this.address = address;
    this.polymath = context.polymath;
  }

  public toString() {
    return this.address;
  }

  public async getBalance(token: types.Tokens) {
    const tokenContract = this.polymath.getTokenContract(token);
    if (this.balances[token] === undefined) {
      const updatedBalance = await this.polymath.polyToken.balanceOf(
        this.address
      );
      this.balances[token] = updatedBalance;
    }

    return this.balances[token];
  }

  public async getAllowance(spender: types.Address | Wallet) {
    if (this.allowances[`${spender}`] === undefined) {
      const updatedAllowance = await this.polymath.polyToken.allowance(
        this.address,
        spender
      );
      this.allowances[`${spender}`] = updatedAllowance;
    }

    return this.allowances[`${spender}`];
  }
}
