// @flow

import BigNumber from 'bignumber.js';
import artifact from 'polymath-core/build/contracts/PercentageTransferManager.json';

import Contract from './Contract';
import type { Address, Investor, Web3Receipt } from '../types';

const LOG_MODIFY_WHITELIST = 'LogModifyWhitelist';

export default class PercentageTransferManager extends Contract {
  paused: () => Promise<boolean>;

  pause: () => Promise<Web3Receipt>;
  unpause: () => Promise<Web3Receipt>;

  constructor(at: Address) {
    super(artifact, at);
  }

  static addDecimals(n: number) {
    n = Number(n);
    if (!Number.isInteger(n) || n < 0 || n > 100) {
      throw new Error('holder percentage must be >= 0 and <= 100');
    }
    return new BigNumber(10).toPower(16).times(n);
  }

  static removeDecimals(n: number | BigNumber): BigNumber {
    return new BigNumber(n).div(new BigNumber(10).toPower(16));
  }

  async maxHolderPercentage(): Promise<number> {
    return PercentageTransferManager.removeDecimals(
      await this._methods.maxHolderPercentage().call()
    );
  }

  async changeHolderPercentage(percentage: number): Promise<Web3Receipt> {
    return this._tx(
      this._methods.changeHolderPercentage(
        PercentageTransferManager.addDecimals(percentage)
      )
    );
  }

  async modifyWhitelist(investor: Investor): Promise<Web3Receipt> {
    return this._tx(
      this._methods.modifyWhitelist(investor.address, investor.isPercentage),
      null,
      2
    );
  }

  async modifyWhitelistMulti(investors: Array<Investor>): Promise<Web3Receipt> {
    const addresses: Array<string> = [];
    // noinspection SpellCheckingInspection
    const valids: Array<boolean> = [];

    for (let investor of investors) {
      addresses.push(investor.address); // $FlowFixMe
      valids.push(investor.isPercentage);
    }

    return this._tx(
      this._methods.modifyWhitelistMulti(addresses, valids),
      null,
      2
    );
  }

  async getWhitelist(): Promise<Array<Investor>> {
    const logs = [];
    const events = await this._contractWS.getPastEvents(LOG_MODIFY_WHITELIST, {
      fromBlock: 0,
      toBlock: 'latest',
    });

    for (let event of events) {
      logs.push({
        address: event.returnValues._investor,
        addedBy: event.returnValues._addedBy,
        added: this._toDate(event.returnValues._dateAdded),
        isPercentage: event.returnValues._valid,
      });
    }

    const investors = [];
    for (let i = 0; i < logs.length; i++) {
      const found = investors.some((el, index, array) => {
        if (el.address === logs[i].address) {
          // $FlowFixMe
          if (logs[i].added > el.added) {
            array[index] = logs[i];
            return true;
          }
          return true;
        }
        return false;
      });
      if (!found) {
        investors.push(logs[i]);
      }
    }
    return investors;
  }
}
