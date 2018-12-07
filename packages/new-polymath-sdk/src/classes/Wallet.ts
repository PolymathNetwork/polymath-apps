import BigNumber from 'bignumber.js';
import { v4 } from 'uuid';
import { types } from '@polymathnetwork/new-shared';
import { PolyToken } from '~/classes/PolyToken';

interface Params {
  id: types.Id;
  address: types.Address;
  token: types.Tokens;
}

const TokenContracts = {
  [types.Tokens.Poly]: PolyToken,
};

export class Wallet implements types.Wallet {
  public id: types.Id = v4();
  public address: types.Address;
  public token: types.Tokens;
  public balance?: BigNumber;
  private allowances: {
    [spender: string]: BigNumber;
  } = {};

  constructor({ id, address, token }: Params) {
    this.id = id || this.id;
    this.address = address;
    this.token = token;
  }

  public toString() {
    return this.address;
  }

  public async getBalance() {
    // Async logic to get balance from address PolyToken.balanceOf(address); for example
    // assign result to `this.balance = result`
    // return this.balance;
    let balance = this.balance;

    if (!balance) {
      balance = PolyToken.balanceOf(address);
      this.balance = balance;
    }

    return this.balance;
  }

  public async getAllowance(spender: types.Address | Wallet) {
    // Async logic to get allowance set from this wallet to an address PolyToken.allowance(this.address, spender)
    // assign result to this.allowances[spender] = value
    // Mocked FOR NOW:
    return await PolyToken.allowance(this.address, spender);
  }
}
