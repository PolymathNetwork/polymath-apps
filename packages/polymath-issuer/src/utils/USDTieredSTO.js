// @flow

import P from 'bluebird';
import { keys, range, compact } from 'lodash';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import Contract from '@polymathnetwork/js';
import USDTieredSTOArtifacts from '@polymathnetwork/shared/fixtures/contracts/USDTieredSTO.json';
import { FUND_RAISE_TYPES } from '../constants';

import type {
  USDTieredSTO as USDTieredSTOType,
  USDTieredSTOTierStatus,
  FundRaiseType,
} from '../constants';

export default class USDTieredSTO {
  address: string;
  contract: Object;

  constructor(address: string) {
    const web3Client = Contract._params.web3;

    this.address = address;
    this.contract = new web3Client.eth.Contract(
      USDTieredSTOArtifacts.abi,
      address
    );
  }

  async pause() {
    const res = await Contract._tx(this.contract.methods.pause());
    return res;
  }

  async unpause() {
    const res = await Contract._tx(this.contract.methods.unpause());
    return res;
  }

  async paused(): Promise<boolean> {
    const isPaused = await this.contract.methods.paused().call();
    return isPaused;
  }

  async getRaiseTypes(): Promise<FundRaiseType[]> {
    let raiseTypes = await P.map(keys(FUND_RAISE_TYPES), async raiseType => {
      const raiseTypeId = FUND_RAISE_TYPES[raiseType];
      const usesType = await this.contract.methods
        .fundRaiseTypes(raiseTypeId)
        .call();
      if (usesType) {
        return raiseType;
      }
    });

    return compact(raiseTypes);
  }

  async getDetails(): Promise<USDTieredSTOType> {
    // TODO: Find better way. Also paralellize
    const startTime = await this.contract.methods.startTime().call();
    const endTime = await this.contract.methods.endTime().call();
    const paused = await this.paused();
    const factoryAddress = await this.contract.methods.factory().call();
    const open = await this.contract.methods.isOpen().call();
    const finalized = await this.contract.methods.isFinalized().call();
    const tiersCount = await this.contract.methods.getNumberOfTiers().call();
    let currentTier = await this.contract.methods.currentTier().call();
    let totalUsdRaised = await this.contract.methods.fundsRaisedUSD().call();
    let totalTokensSold = await this.contract.methods.getTokensSold().call();

    currentTier = parseInt(currentTier, 10);
    totalUsdRaised = new BigNumber(Web3.utils.fromWei(totalUsdRaised));
    totalTokensSold = new BigNumber(Web3.utils.fromWei(totalTokensSold));

    // Get tiers data
    const tiers = await P.map(range(tiersCount), async tierNumber => {
      const rateRes = await this.contract.methods
        .ratePerTier(tierNumber)
        .call();
      const totalTokensRes = await this.contract.methods
        .tokensPerTierTotal(tierNumber)
        .call();
      const tokensSoldRes = await this.contract.methods
        .mintedPerTierTotal(tierNumber)
        .call();

      const totalTokens = new BigNumber(Web3.utils.fromWei(totalTokensRes));
      const tokensSold = new BigNumber(Web3.utils.fromWei(tokensSoldRes));
      const rate = new BigNumber(Web3.utils.fromWei(rateRes), 10);
      const totalUsd = totalTokens.times(rate);
      const usdRaised = tokensSold.times(rate);
      let status: USDTieredSTOTierStatus;

      if (tierNumber < currentTier) {
        status = 'done';
      } else if (tierNumber === currentTier) {
        status = 'active';
      } else {
        status = 'not-started';
      }

      return {
        rate,
        tokensSold,
        totalTokens,
        totalUsd,
        usdRaised,
        status,
      };
    });

    return {
      type: 'USDTieredSTO',
      startDate: new Date(startTime * 1000),
      endDate: new Date(endTime * 1000),
      pauseStatus: paused,
      factoryAddress,
      open,
      currentTier,
      finalized,
      tiers,
      totalUsdRaised,
      totalTokensSold,
    };
  }
}
