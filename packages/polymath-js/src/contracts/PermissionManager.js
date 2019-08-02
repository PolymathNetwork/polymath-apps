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
    return this._tx(this._methods.addDelegate(at, this._toBytes(details)));
  }

  async getDelegateDetails(delegate: Address) {
    let details = await this._methods.delegateDetails(delegate).call();
    return this._toAscii(details);
  }

  async getAllDelegates(moduleAddress: Address, permission: string) {
    return this._methods
      .getAllDelegatesWithPerm(moduleAddress, this._toBytes(permission))
      .call();
  }

  async changePermission(
    delegate: Address,
    moduleAddress: Address,
    permission: string,
    valid: boolean
  ) {
    return this._tx(
      this._methods.changePermission(
        delegate,
        moduleAddress,
        this._toBytes(permission),
        valid
      )
    );
  }
}
