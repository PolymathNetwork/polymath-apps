// @flow
import semver from 'semver';
import artifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/VolumeRestrictionTM.json';
import { LATEST_PROTOCOL_VERSION } from '../constants';
import BigNumber from 'bignumber.js';

import Contract from './Contract';
import type { Address, RestrictionType } from '../types';

export default class VolumeRestrictionTransferManager extends Contract {
  version: string = LATEST_PROTOCOL_VERSION;
  constructor(at: Address, version?: string = LATEST_PROTOCOL_VERSION) {
    super(artifact, at);
    version = version;
  }

  async addDefaultRestriction(
    allowedTokens: BigNumber,
    startTime: Date,
    rollingPeriodInDays: number,
    endTime: Date,
    restrictionType: RestrictionType
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

  async addDefaultDailyRestriction(
    allowedTokens: BigNumber,
    startTime: Date,
    endTime: Date,
    restrictionType: RestrictionType
  ) {
    return this._tx(
      this._methods.addDefaultDailyRestriction(
        allowedTokens,
        startTime,
        endTime,
        restrictionType
      )
    );
  }

  async modifyDefaultRestriction(
    allowedTokens: BigNumber,
    startTime: Date,
    rollingPeriodInDays: number,
    endTime: Date,
    restrictionType: RestrictionType
  ) {
    return this._tx(
      this._methods.modifyDefaultRestriction(
        allowedTokens,
        startTime,
        rollingPeriodInDays,
        endTime,
        restrictionType
      )
    );
  }

  async modifyDefaultDailyRestriction(
    allowedTokens: BigNumber,
    startTime: Date,
    endTime: Date,
    restrictionType: RestrictionType
  ) {
    return this._tx(
      this._methods.modifyDefaultDailyRestriction(
        allowedTokens,
        startTime,
        endTime,
        restrictionType
      )
    );
  }

  async getDefaultRestriction() {
    const defaultRestrictions = await this._methods
      .getDefaultRestriction()
      .call();
    return {
      allowedTokens: defaultRestrictions[0],
      startTime: defaultRestrictions[1],
      rollingPeriodInDays: defaultRestrictions[2],
      endTime: defaultRestrictions[3],
      restrictionType: parseInt(defaultRestrictions[4]),
    };
  }

  async getDefaultDailyRestriction() {
    const defaultRestrictions = await this._methods
      .getDefaultDailyRestriction()
      .call();
    return {
      allowedTokens: defaultRestrictions[0],
      startTime: defaultRestrictions[1],
      rollingPeriodInDays: defaultRestrictions[2],
      endTime: defaultRestrictions[3],
      restrictionType: parseInt(defaultRestrictions[4]),
    };
  }

  async addIndividualDailyRestriction(
    holder: Address,
    allowedTokens: BigNumber,
    startTime: Date,
    endTime: Date,
    restrictionType
  ) {
    return this._tx(
      this._methods.addIndividualDailyRestriction(
        holder,
        allowedTokens,
        startTime,
        endTime,
        restrictionType
      )
    );
  }

  async addIndividualRestriction(
    holder: Address,
    allowedTokens: BigNumber,
    startTime: Date,
    rollingPeriodInDays: number,
    endTime: Date,
    restrictionType
  ) {
    return this._tx(
      this._methods.addIndividualRestriction(
        holder,
        allowedTokens,
        startTime,
        rollingPeriodInDays,
        endTime,
        restrictionType
      )
    );
  }

  async modifyIndividualDailyRestriction(
    holder: Address,
    allowedTokens: BigNumber,
    startTime: Date,
    endTime: Date,
    restrictionType
  ) {
    return this._tx(
      this._methods.modifyIndividualDailyRestriction(
        holder,
        allowedTokens,
        startTime,
        endTime,
        restrictionType
      )
    );
  }

  async modifyIndividualRestriction(
    holder: Address,
    allowedTokens: BigNumber,
    startTime: Date,
    rollingPeriodInDays: number,
    endTime: Date,
    restrictionType
  ) {
    return this._tx(
      this._methods.modifyIndividualRestriction(
        holder,
        allowedTokens,
        startTime,
        rollingPeriodInDays,
        endTime,
        restrictionType
      )
    );
  }

  async getIndividualRestrictions() {
    const restrictionData = await this._methods.getRestrictionData().call();
    const restrictions = [];
    for (let i = 0; i < restrictionData.allAddresses.length; i++) {
      let individualRestriction = {};

      individualRestriction.address = restrictionData.allAddresses[i];
      individualRestriction.id = restrictionData.allAddresses[i];
      if (restrictionData.rollingPeriodInDays[i] === '1') {
        individualRestriction.dailyStartTime = restrictionData.startTime[i];
        individualRestriction.dailyEndTime = restrictionData.endTime[i];
        individualRestriction.dailyRestrictionType =
          restrictionData.typeOfRestriction[i];
        individualRestriction.dailyAllowedTokens = this._fromWei(
          restrictionData.allowedTokens[i]
        );
      } else {
        individualRestriction.customStartTime = restrictionData.startTime[i];
        individualRestriction.customEndTime = restrictionData.endTime[i];
        individualRestriction.rollingPeriodInDays =
          restrictionData.rollingPeriodInDays[i];
        individualRestriction.customRestrictionType =
          restrictionData.typeOfRestriction[i];
        individualRestriction.customAllowedTokens = this._fromWei(
          restrictionData.allowedTokens[i]
        );
      }

      if (
        restrictionData.allAddresses[i] === restrictionData.allAddresses[i + 1]
      ) {
        if (restrictionData.rollingPeriodInDays[i + 1] === '1') {
          individualRestriction.dailyStartTime =
            restrictionData.startTime[i + 1];
          individualRestriction.dailyEndTime = restrictionData.endTime[i + 1];
          individualRestriction.dailyRestrictionType =
            restrictionData.typeOfRestriction[i + 1];
          individualRestriction.dailyAllowedTokens = this._fromWei(
            restrictionData.allowedTokens[i + 1]
          );
        } else {
          individualRestriction.customStartTime =
            restrictionData.startTime[i + 1];
          individualRestriction.customEndTime = restrictionData.endTime[i + 1];
          individualRestriction.rollingPeriodInDays =
            restrictionData.rollingPeriodInDays[i + 1];
          individualRestriction.customRestrictionType =
            restrictionData.typeOfRestriction[i + 1];
          individualRestriction.customAllowedTokens = this._fromWei(
            restrictionData.allowedTokens[i + 1]
          );
        }
        i++;
      }
      restrictions.push(individualRestriction);
    }
    return restrictions;
  }

  async removeDefaultRestriction() {
    return this._tx(this._methods.removeDefaultRestriction());
  }

  async removeDefaultDailyRestriction() {
    return this._tx(this._methods.removeDefaultDailyRestriction());
  }

  async addIndividualRestrictionMulti(
    holders,
    allowedTokens,
    startTimes,
    rollingPeriodInDays,
    endTimes,
    restrictionTypes
  ) {
    return this._tx(
      this._methods.addIndividualRestrictionMulti(
        holders,
        allowedTokens,
        startTimes,
        rollingPeriodInDays,
        endTimes,
        restrictionTypes
      )
    );
  }

  async addIndividualDailyRestrictionMulti(
    holders,
    allowedTokens,
    startTimes,
    endTimes,
    restrictionTypes
  ) {
    return this._tx(
      this._methods.addIndividualDailyRestrictionMulti(
        holders,
        allowedTokens,
        startTimes,
        endTimes,
        restrictionTypes
      )
    );
  }
}
