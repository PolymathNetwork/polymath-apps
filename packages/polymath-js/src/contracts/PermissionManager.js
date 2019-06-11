// @flow
import semver from 'semver';
import artifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/GeneralPermissionManager.json';
import artifact2 from '@polymathnetwork/polymath-scripts/fixtures/contracts/GeneralPermissionManager-2.x.json';
import { LATEST_PROTOCOL_VERSION } from '../constants';

import Contract from './Contract';
import type { Address } from '../types';

export default class PermissionManager extends Contract {
  constructor(at: Address, version?: string = LATEST_PROTOCOL_VERSION) {
    if (semver.lt(version)) {
      super(artifact2, at);
      return;
    }

    super(artifact, at);
  }
}
