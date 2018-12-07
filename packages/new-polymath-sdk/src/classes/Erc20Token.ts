import { types } from '@polymathnetwork/new-shared';
import { Wallet } from './Wallet';
import BigNumber from 'bignumber.js';
import { Addressable, Erc20 } from './types';

/**
 * NOTE @RafaelVidaurre: This is temporary code while we build this
 * package together with the low-level api. This should be a
 */

const blockchainStub: {
  [address: string]: {
    allowances: {
      [spender: string]: BigNumber | undefined;
    };
    balance: BigNumber;
  };
} = {};

export class Erc20Token implements Erc20 {
  public address: types.Address;

  private get stubData() {
    return blockchainStub[this.address];
  }

  constructor(address: types.Address) {
    this.address = address;

    blockchainStub[address] = {
      allowances: {},
      balance: new BigNumber(0),
    };
  }

  public async allowance(tokenOwner: Addressable, spender: Addressable) {
    this.stubData.allowances = this.stubData.allowances || {};
    const allowance = this.stubData.allowances[`${spender}`];

    if (allowance === undefined) {
      return new BigNumber(0);
    }
    return new BigNumber(allowance);
  }

  public async approve(spender: Addressable, amount: BigNumber) {
    this.stubData.allowances = this.stubData.allowances || {};
    this.stubData.allowances[`${spender}`] = amount;
    return true;
  }

  public async balanceOf(address: Addressable) {
    return this.stubData.balance;
  }

  public async transfer(to: Addressable) {
    return true;
  }
}

export const PolyToken = new Erc20Token('0x0123456789');
