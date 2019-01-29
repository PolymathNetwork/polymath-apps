// @flow

import artifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/PolyToken.json';
import artifactTestnet from '@polymathnetwork/polymath-scripts/fixtures/contracts/PolyTokenFaucet.json';
import { MAINNET_NETWORK_ID } from '@polymathnetwork/shared/constants';
import BigNumber from 'bignumber.js';

import Contract from './Contract';
import type { Address, Web3Event, Web3Receipt } from '../types';

export const TRANSFER_EVENT = 'Transfer';
export const APPROVAL_EVENT = 'Approval';

export class PolyToken extends Contract {
  decimals: number = 18;
  symbol: string = 'POLY';
  name: string = 'Polymath Network';

  allowance: (owner: Address, spender: Address) => Promise<BigNumber>;

  addDecimals(n: number | BigNumber): BigNumber {
    return new BigNumber(10).toPower(this.decimals).times(n);
  }

  removeDecimals(n: number | BigNumber): BigNumber {
    return new BigNumber(n).div(new BigNumber(10).toPower(this.decimals));
  }

  async balanceOf(account: Address): Promise<BigNumber> {
    return this.removeDecimals(
      await this._contractWS.methods.balanceOf(account).call()
    );
  }

  async myBalance(): Promise<BigNumber> {
    return this.balanceOf(this.account);
  }

  async allowance(owner: Address, spender: Address): Promise<BigNumber> {
    return this.removeDecimals(
      await this._methods.allowance(owner, spender).call()
    );
  }

  async getTokens(amount: number | BigNumber): Promise<Web3Receipt> {
    if (Contract.isMainnet()) {
      throw new Error('POLY faucet is not available on mainnet');
    }
    return this._tx(
      this._methods.getTokens(this.addDecimals(amount), this.account)
    );
  }

  async transfer(to: Address, amount: BigNumber) {
    return this._tx(this._methods.transfer(to, this.addDecimals(amount)));
  }

  async transferFrom(from: Address, to: Address, amount: BigNumber) {
    return this._tx(
      this._methods.transferFrom(from, to, this.addDecimals(amount))
    );
  }

  async approve(spender: Address, amount: BigNumber) {
    return this._tx(this._methods.approve(spender, this.addDecimals(amount)));
  }

  async increaseApproval(spender: Address, amount: BigNumber) {
    return this._tx(
      this._methods.increaseApproval(spender, this.addDecimals(amount))
    );
  }

  async decreaseApproval(spender: Address, amount: BigNumber) {
    return this._tx(
      this._methods.decreaseApproval(spender, this.addDecimals(amount))
    );
  }

  async subscribeMyTransfers(
    callback: (toOrFrom: Address, value: BigNumber, isSent: boolean) => void
  ) {
    const valueKey = 'value',
      toKey = 'to',
      fromKey = 'from';

    const callbackInternal = (event: Web3Event) => {
      const values = event.returnValues;

      const value = new BigNumber(values[valueKey]);
      const isSent = values[fromKey] === this.account;
      callback(
        isSent ? values[toKey] : values[fromKey],
        this.removeDecimals(value),
        isSent
      );
    };
    const filterFrom = {};
    filterFrom[fromKey] = this.account;
    const filterTo = {};
    filterTo[toKey] = this.account;
    return Promise.all([
      this.subscribe(TRANSFER_EVENT, filterFrom, callbackInternal),
      this.subscribe(TRANSFER_EVENT, filterTo, callbackInternal),
    ]);
  }
}

export default new PolyToken(artifact, undefined, artifactTestnet);
