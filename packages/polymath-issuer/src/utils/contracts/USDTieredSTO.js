// @flow

import { map } from 'lodash';
import P from 'bluebird';
import { keys, range, compact } from 'lodash';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import Contract from '@polymathnetwork/js';
import USDTieredSTOArtifacts from '@polymathnetwork/polymath-scripts/fixtures/contracts/USDTieredSTO.json';
import { FUND_RAISE_TYPES, EVENT_TYPES } from '../../constants';
import { toWei } from './index';

import type {
  USDTieredSTO as USDTieredSTOType,
  USDTieredSTOTierStatus,
  FundRaiseType,
} from '../../constants';

export default class USDTieredSTO {
  address: string;
  contract: Object;
  wsContract: Object;
  legacyContractInstance: {
    _tx: (method: Object) => Promise<Object>,
  };

  constructor(address: string) {
    const web3Client = Contract._params.web3;
    const web3WsClient = Contract._params.web3WS;

    // FIXME @RafaelVidaurre: Remove this dependency ASAP, using this for now
    // to quickly get transactions running
    this.legacyContractInstance = new Contract(USDTieredSTOArtifacts, address);
    this.contract = new web3Client.eth.Contract(
      USDTieredSTOArtifacts.abi,
      address
    );
    this.wsContract = new web3WsClient.eth.Contract(
      USDTieredSTOArtifacts.abi,
      address
    );
    this.address = address;
  }

  async getPurchases() {
    const events = await this.wsContract.getPastEvents(
      EVENT_TYPES.TOKEN_PURCHASE,
      {
        fromBlock: 0,
        toBlock: 'latest',
      }
    );

    return map(events, ({ returnValues }) => {
      return {
        investor: returnValues._purchaser,
        receiver: returnValues._beneficiary,
        tokens: new BigNumber(Web3.utils.fromWei(returnValues._tokens)),
        usd: new BigNumber(Web3.utils.fromWei(returnValues._usdAmount)),
        tier: parseInt(returnValues._tier, 10) + 1,
        tierPrice: new BigNumber(Web3.utils.fromWei(returnValues._tierPrice)),
      };
    });
  }

  async pause() {
    const res = await this.legacyContractInstance._tx(
      this.contract.methods.pause()
    );
    return res;
  }

  async unpause() {
    const res = await this.legacyContractInstance._tx(
      this.contract.methods.unpause()
    );
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

  /**
   * Updates the accredited status of a list of addresses
   *
   * @param addresses addresses to update
   * @param statuses statuses for each address matched by index
   */
  async changeAccredited(addresses: string[], statuses: boolean[]) {
    const checksumAddresses = addresses.map(Web3.utils.toChecksumAddress);

    await this.legacyContractInstance._tx(
      this.contract.methods.changeAccredited(checksumAddresses, statuses)
    );
  }

  /**
   * Sets individual limits for non-accredited investors
   *
   * @param addresses addresses to update
   * @param limits limits to set for each address matched by index
   */
  async changeNonAccreditedLimit(addresses: string[], limits: BigNumber[]) {
    const limitsInWei = limits.map(limit => toWei(limit.toFixed()));
    await this.legacyContractInstance._tx(
      this.contract.methods.changeNonAccreditedLimit(addresses, limitsInWei)
    );
  }

  async getDetails(): Promise<USDTieredSTOType> {
    const [
      startTime,
      endTime,
      paused,
      factoryAddress,
      isOpen,
      isFinalized,
      tiersCount,
      currentTierRes,
      totalUsdRaisedRes,
      totalTokensSoldRes,
      capReached,
    ] = await Promise.all([
      this.contract.methods.startTime().call(),
      this.contract.methods.endTime().call(),
      this.paused(),
      this.contract.methods.factory().call(),
      this.contract.methods.isOpen().call(),
      this.contract.methods.isFinalized().call(),
      this.contract.methods.getNumberOfTiers().call(),
      this.contract.methods.currentTier().call(),
      this.contract.methods.fundsRaisedUSD().call(),
      this.contract.methods.getTokensSold().call(),
      this.contract.methods.capReached().call(),
    ]);

    const currentTier = parseInt(currentTierRes, 10);
    const totalUsdRaised = new BigNumber(
      Web3.utils.fromWei(totalUsdRaisedRes.toString())
    );
    const totalTokensSold = new BigNumber(
      Web3.utils.fromWei(totalTokensSoldRes.toString())
    );

    // Get tiers data
    let tiers = await P.map(range(tiersCount), async tierNumber => {
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
      const rate = new BigNumber(Web3.utils.fromWei(rateRes));
      const totalUsd = totalTokens.times(rate);
      const usdRaised = tokensSold.times(rate);
      let status: USDTieredSTOTierStatus;

      if (tierNumber < currentTier || totalTokens <= tokensSold) {
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

    // NOTE @RafaelVidaurre: We need to calculate tokens sold per tier
    // since we don't have a method to get tokens sold, and mintedPerTier can
    // cause errors in specific situations
    let totalTokensSum = new BigNumber(0);

    tiers = map(tiers, tier => {
      const { tokensSold, totalTokens: tierTotalTokens } = tier;
      let thisTokensSold = tokensSold;

      totalTokensSum = totalTokensSum.plus(tierTotalTokens);

      const tierIsFullySold = totalTokensSum.lte(totalTokensSold);

      if (!tierIsFullySold) {
        thisTokensSold = totalTokensSold.minus(
          totalTokensSum.minus(tierTotalTokens)
        );
        if (thisTokensSold.lt(0)) {
          thisTokensSold = new BigNumber(0);
        }
      }

      return { ...tier, tokensSold: thisTokensSold };
    });

    return {
      type: 'USDTieredSTO',
      startDate: new Date(startTime * 1000),
      endDate: new Date(endTime * 1000),
      pauseStatus: paused,
      factoryAddress,
      address: this.address,
      isOpen,
      isTerminated: isFinalized,
      capReached,
      tiers,
      currentTier,
      totalUsdRaised,
      totalTokensSold,
    };
  }
}
