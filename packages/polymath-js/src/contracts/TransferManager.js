// @flow

import semver from 'semver';
import artifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/GeneralTransferManager.json';
import artifact2 from '@polymathnetwork/polymath-scripts/fixtures/contracts/2.x/GeneralTransferManager.json';
import { LATEST_PROTOCOL_VERSION } from '../constants';
import Web3 from 'web3';

import Contract from './Contract';
import type { Address, Investor, Web3Receipt } from '../types';

const MODIFY_WHITELIST_EVENT = 'ModifyWhitelist';
const MODIFY_KYC_DATA = 'ModifyKYCData';
const MODIFY_INVESTOR_FLAG = 'ModifyInvestorFlag';

export default class TransferManager extends Contract {
  paused: () => Promise<boolean>;

  pause: () => Promise<Web3Receipt>;
  unpause: () => Promise<Web3Receipt>;

  version: string = LATEST_PROTOCOL_VERSION;
  constructor(at: Address, _version?: string = LATEST_PROTOCOL_VERSION) {
    if (semver.lt(_version, LATEST_PROTOCOL_VERSION)) {
      super(artifact2, at);
      this.version = _version;
      return;
    } else {
      super(artifact, at);
      this.version = _version;
    }
  }

  _mapLogsToInvestors(logs: Array<{}>): Array<Investor> {
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
    const removeZeroTimestampArray = [];
    for (let j = 0; j < investors.length; j++) {
      // $FlowFixMe
      if (
        investors[j].from.getTime() !== 0 &&
        investors[j].to.getTime() !== 0
      ) {
        removeZeroTimestampArray.push(investors[j]);
      }
    }

    return removeZeroTimestampArray;
  }

  _mapFlagKeyToLabel(flag: number): string {
    const map = ['accredited', 'canNotBuyFromSTO', 'isVolRestricted'];

    return map[flag];
  }

  async modifyWhitelist(investor: Investor): Promise<Web3Receipt> {
    return this._tx(
      this._methods.modifyWhitelist(
        investor.address, // $FlowFixMe
        this._toUnixTS(investor.from), // $FlowFixMe
        this._toUnixTS(investor.to), // $FlowFixMe
        this._toUnixTS(investor.expiry),
        investor.canBuyFromSTO
      ),
      null,
      2
    );
  }

  async modifyKYCData(investor: Investor): Promise<Web3Receipt> {
    if (semver.lt(this.version, LATEST_PROTOCOL_VERSION))
      return this.modifyWhitelist(...arguments);

    // $FlowFixMe
    return this._tx(
      this._methods.modifyKYCData(
        investor.address, // $FlowFixMe
        this._toUnixTS(investor.from), // $FlowFixMe
        this._toUnixTS(investor.to), // $FlowFixMe
        this._toUnixTS(investor.expiry)
      ),
      null,
      2
    );
  }

  async modifyInvestorFlag(address: string, flag: Number, value: boolean) {
    if (semver.lt(this.version, LATEST_PROTOCOL_VERSION)) return;

    return this._tx(
      this._methods.modifyInvestorFlag(address, flag, value),
      null,
      2
    );
  }

  async modifyInvestorFlagMulti(
    addresses: Array<string>,
    flags: Array<number>,
    values: Array<boolean>
  ) {
    if (semver.lt(this.version, LATEST_PROTOCOL_VERSION)) return;

    return this._tx(
      this._methods.modifyInvestorFlagMulti(addresses, flags, values),
      null,
      2
    );
  }

  async modifyWhitelistMulti(investors: Array<Investor>): Promise<Web3Receipt> {
    const addresses: Array<string> = [];
    const fromTimes: Array<number> = [];
    const toTimes: Array<number> = [];
    const expiryTimes: Array<number> = [];
    const canBuyFromSTO: Array<boolean> = [];

    for (let investor of investors) {
      addresses.push(investor.address); // $FlowFixMe
      fromTimes.push(this._toUnixTS(investor.from)); // $FlowFixMe
      toTimes.push(this._toUnixTS(investor.to)); // $FlowFixMe
      expiryTimes.push(this._toUnixTS(investor.expiry)); // $FlowFixMe
      canBuyFromSTO.push(investor.canBuyFromSTO);
    }

    return this._tx(
      this._methods.modifyWhitelistMulti(
        addresses,
        fromTimes,
        toTimes,
        expiryTimes,
        canBuyFromSTO
      ),
      null,
      2
    );
  }

  async modifyKYCDataMulti(investors: Array<Investor>): Promise<Web3Receipt> {
    if (semver.lt(this.version, LATEST_PROTOCOL_VERSION))
      return this.modifyWhitelistMulti(...arguments);

    const addresses: Array<string> = [];
    const fromTimes: Array<number> = [];
    const toTimes: Array<number> = [];
    const expiryTimes: Array<number> = [];
    const flags: Array<number> = [];
    const cannotBuyFromSTO: Array<boolean> = [];

    for (let investor of investors) {
      addresses.push(investor.address); // $FlowFixMe
      fromTimes.push(this._toUnixTS(investor.from)); // $FlowFixMe
      toTimes.push(this._toUnixTS(investor.to)); // $FlowFixMe
      expiryTimes.push(this._toUnixTS(investor.expiry)); // $FlowFixMe
    }

    return this._tx(
      this._methods.modifyKYCDataMulti(
        addresses,
        fromTimes,
        toTimes,
        expiryTimes
      ),
      null,
      2
    );
  }

  async getWhitelist2(cannotBuyFromSTO?: boolean): Promise<Array<Investor>> {
    const logs = [];
    const events = await this._contractWS.getPastEvents(
      MODIFY_WHITELIST_EVENT,
      {
        filter: cannotBuyFromSTO ? { _canBuyFromSTO: false } : {},
        fromBlock: 0,
        toBlock: 'latest',
      }
    );

    for (let i = events.length - 1; i >= 0; i--) {
      const event = events[i];

      logs.push({
        address: event.returnValues._investor,
        addedBy: event.returnValues._addedBy,
        added: this._toDate(event.returnValues._dateAdded),
        from: this._toDate(event.returnValues._fromTime),
        to: this._toDate(event.returnValues._toTime),
        expiry: this._toDate(event.returnValues._expiryTime),
        canBuyFromSTO: event.returnValues._canBuyFromSTO,
      });
    }

    return this._mapLogsToInvestors(logs);
  }

  async getWhitelist(): Promise<Array<Investor>> {
    if (semver.lt(this.version, LATEST_PROTOCOL_VERSION))
      return this.getWhitelist2(...arguments);

    const logs = [];
    const events = await this._contractWS.getPastEvents(MODIFY_KYC_DATA, {
      fromBlock: 0,
      toBlock: 'latest',
    });

    for (let i = events.length - 1; i >= 0; i--) {
      const event = events[i];

      logs.push({
        address: event.returnValues._investor,
        addedBy: event.returnValues._addedBy,
        from: this._toDate(event.returnValues._canSendAfter),
        to: this._toDate(event.returnValues._canReceiveAfter),
        expiry: this._toDate(event.returnValues._expiryTime),
      });
    }
    const investors = this._mapLogsToInvestors(logs);

    // Supplement investors with investor flags (v3.x).
    let allInvestorFlagData = await this._methods.getAllInvestorFlags().call();
    let investorsArray = allInvestorFlagData.investors;
    let flagsArray = allInvestorFlagData.flags;
    for (let i = 0; i < investorsArray.length; i++) {
      // Locate the investor object to update.
      const x = investors.findIndex(
        investor => investor.address === investorsArray[i]
      );

      let flags = new Web3.utils.BN(flagsArray[i]);
      let flagNumbers = [];
      // Decode investor flags. flags variable is a uint256 representation of the flags, where
      // each bit represents an active flag.

      // Investors can buy from STO, by default.
      investors[x]['canBuyFromSTO'] = true;
      for (let j = 0; j < 256; j++) {
        if (flags.testn(j)) {
          flagNumbers.push(j);
          const key = this._mapFlagKeyToLabel(j);
          // Negate canBuyFromSTO value.
          if (key === 'canNotBuyFromSTO') {
            investors[x]['canBuyFromSTO'] = false;
          } else {
            investors[x][key] = true;
          }
        }
      }
    }

    return investors;
  }
}
