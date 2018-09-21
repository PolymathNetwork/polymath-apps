// @flow

import artifact from '@polymathnetwork/shared/fixtures/contracts/PolyToken.json';
import artifactTestnet from '@polymathnetwork/shared/fixtures/contracts/PolyTokenFaucet.json';
import BigNumber from 'bignumber.js';

import Contract from './Contract';
import type { Address, Web3Event, Web3Receipt } from '../types';

export const TRANSFER = 'Transfer';
export const APPROVAL = 'Approval';

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
    return this.removeDecimals(await this._methods.balanceOf(account).call());
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
    const callbackInternal = (event: Web3Event) => {
      const values = event.returnValues;
      const value = new BigNumber(values._value);
      const isSent = values._from === this.account;
      callback(
        isSent ? values._to : values._from,
        this.removeDecimals(value),
        isSent
      );
    };
    return Promise.all([
      this.subscribe(TRANSFER, { _from: this.account }, callbackInternal),
      this.subscribe(TRANSFER, { _to: this.account }, callbackInternal),
    ]);
  }
}

export default new PolyToken(artifact, undefined, artifactTestnet);
