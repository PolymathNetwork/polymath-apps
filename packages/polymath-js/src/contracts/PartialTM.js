// @flow
import semver from 'semver';
import artifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/RestrictedPartialSaleTM.json';
import { LATEST_PROTOCOL_VERSION } from '../constants';
import BigNumber from 'bignumber.js';

import Contract from './Contract';
import type { Address, RestrictionType } from '../types';

export default class PartialTM extends Contract {
  version: string = LATEST_PROTOCOL_VERSION;
  constructor(at: Address, version?: string = LATEST_PROTOCOL_VERSION) {
    super(artifact, at);
    version = version;
  }

  async getExemptAddresses() {
    return await this._methods.getExemptAddresses().call();
  }

  async addExemptAddress(address: Address) {
    return this._tx(this._methods.changeExemptWalletList(address, true));
  }

  async removeExemptAddress(address: Address) {
    return this._tx(this._methods.changeExemptWalletList(address, false));
  }
}
