// @flow
import semver from 'semver';
import artifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/VolumeRestrictionTM.json';
import artifact2 from '@polymathnetwork/polymath-scripts/fixtures/contracts/VolumeRestrictionTM.json';
import { LATEST_PROTOCOL_VERSION } from '../constants';
import BigNumber from 'bignumber.js';

import Contract from './Contract';
import type { Address } from '../types';

export default class VolumeRestrictionTransferManager extends Contract {
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

  async addDefaultRestriction(
    allowedTokens: BigNumber,
    startTime: Date,
    rollingPeriodInDays: number,
    endTime: Date,
    restrictionType
  ) {
    return this._tx(
      this._methods.addDefaultRestriction(
        allowedTokens,
        startTime,
        rollingPeriodInDays,
        endTime,
        restrictionType
      )
    );
  }

  async addDefaultDailyRestriction() {}

  async getDefaultRestriction() {
    const defaultRestrictions = await this._methods
      .getDefaultRestriction()
      .call();
    return {
      allowedTokens: defaultRestrictions[0],
      startTime: defaultRestrictions[1],
      rollingPeriodInDays: defaultRestrictions[2],
      endTime: defaultRestrictions[3],
      restrictionType: defaultRestrictions[4],
    };
  }
}
