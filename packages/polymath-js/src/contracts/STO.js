// @flow

import artifact from 'polymath-core/build/contracts/CappedSTO.json';
import BigNumber from 'bignumber.js';

import Contract from './Contract';
import { PolyToken, SecurityToken } from '../index';
import type {
  Address,
  STODetails,
  STOPurchase,
  Web3Receipt,
} from '../types';

const LOG_TOKEN_PURCHASE = 'TokenPurchase';

export const FUNDRAISE_ETH = 0;
export const FUNDRAISE_POLY = 1;

export default class STO extends Contract {
  wallet: () => Promise<Address>;
  capReached: () => Promise<boolean>;
  paused: () => Promise<boolean>;

  pause: () => Promise<Web3Receipt>;

  token: SecurityToken;

  constructor(at: Address, _token: SecurityToken) {
    super(artifact, at);
    this.token = _token;
  }

  async tokensSold(): Promise<BigNumber> {
    return this.token.removeDecimals(await this._methods.tokensSold().call());
  }

  async checkFundraise(type: number): Promise<boolean> {
    try {
      // $FlowFixMe
      return await this.fundRaiseType(type);
    } catch (e) {
      // $FlowFixMe
      return Number(await this.fundraiseType()) === type;
    }
  }

  async isPolyFundraise(): Promise<boolean> {
    return this.checkFundraise(FUNDRAISE_POLY);
  }

  async isEthFundraise(): Promise<boolean> {
    return this.checkFundraise(FUNDRAISE_ETH);
  }

  async getDetails(): Promise<STODetails> {
    const [
      startTime,
      endTime,
      cap,
      rate,
      fundsRaised,
      investorCount,
      tokensSold,
      isPolyFundraise,
    ] = this._toArray(await this._methods.getSTODetails().call());

    return {
      address: this.address,
      start: this._toDate(startTime),
      end: this._toDate(endTime),
      cap: this._fromWei(cap),
      raised: this._fromWei(fundsRaised),
      tokensSold: this.token.removeDecimals(tokensSold),
      rate,
      investorCount,
      isPolyFundraise,
    };
  }

  async getPurchases(): Promise<Array<STOPurchase>> {
    const result = [];
    const events = await this._contractWS.getPastEvents(LOG_TOKEN_PURCHASE, {
      fromBlock: 0,
      toBlock: 'latest',
    });
    const isPolyFundraise = await this.isPolyFundraise();
    for (let event of events) {
      // noinspection JSUnresolvedVariable
      result.push({
        investor: event.returnValues.beneficiary,
        txHash: event.transactionHash,
        amount: await this.token.removeDecimals(event.returnValues.amount),
        paid: isPolyFundraise
          ? this._fromWei(event.returnValues.value)
          : PolyToken.removeDecimals(event.returnValues.value),
      });
    }
    return result;
  }

  async buy(value: BigNumber): Promise<Web3Receipt> {
    if (await this.isPolyFundraise()) {
      const allowance = await PolyToken.allowance(this.account, this.address);
      if (allowance.lt(value)) {
        await PolyToken.approve(this.address, value);
      }
      return this._tx(
        this._methods.buyTokensWithPoly(PolyToken.addDecimals(value))
      );
    }
    return this._tx(this._methods.buyTokens(this.account), value);
  }

  async unpause(newEndDate: Date): Promise<Web3Receipt> {
    return this._tx(this._methods.unpause(this._toUnixTS(newEndDate)));
  }
}
