// @flow

import semver from 'semver';
import artifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/CountTransferManager.json';
import artifact2 from '@polymathnetwork/polymath-scripts/fixtures/contracts/CountTransferManager-2.x.json';
import { LATEST_PROTOCOL_VERSION } from '../constants';

import Contract from './Contract';
import type { Address, Web3Receipt } from '../types';

export default class CountTransferManager extends Contract {
  maxHolderCount: () => Promise<number>;
  paused: () => Promise<boolean>;

  pause: () => Promise<Web3Receipt>;
  unpause: () => Promise<Web3Receipt>;

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

  async changeHolderCount(count: number): Promise<Web3Receipt> {
    return this._tx(this._methods.changeHolderCount(count));
  }
}
