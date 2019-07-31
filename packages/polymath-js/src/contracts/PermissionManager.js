// @flow
import semver from 'semver';
import artifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/GeneralPermissionManager.json';
import artifact2 from '@polymathnetwork/polymath-scripts/fixtures/contracts/2.x/GeneralPermissionManager.json';
import { LATEST_PROTOCOL_VERSION } from '../constants';

import Contract from './Contract';
import type { Address } from '../types';

export default class PermissionManager extends Contract {
  version: string = LATEST_PROTOCOL_VERSION;
  constructor(at: Address, version?: string = LATEST_PROTOCOL_VERSION) {
    if (semver.lt(version, LATEST_PROTOCOL_VERSION)) {
      super(artifact2, at);
      return;
    } else {
      super(artifact, at);
    }
    version = version;
  }

  async addDelegate(at: Address, details: string) {
    return this._methods.addDelegate(at, this._toBytes(details)).call();
  }

  async getAllDelegates(permission: string) {
    return this._methods
      .getAllDelegatesWithPerm(this.address, this._toBytes(permission))
      .call();
  }
}
