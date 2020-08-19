// @flow

import { map } from 'lodash';
import semver from 'semver';
import P from 'bluebird';
import { keys, range, compact } from 'lodash';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import Contract, { SecurityToken } from '@polymathnetwork/js';
import artifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/USDTieredSTO.json';
import artifact2 from '@polymathnetwork/polymath-scripts/fixtures/contracts/2.x/USDTieredSTO.json';
import { FUND_RAISE_TYPES, EVENT_TYPES } from '../../constants';
import { toWei } from './index';
import { LATEST_PROTOCOL_VERSION } from '../../constants';
import type {
  USDTieredSTO as USDTieredSTOType,
  USDTieredSTOTierStatus,
  FundRaiseType,
} from '../../constants';

export default class USDTieredSTO {
  version: string = LATEST_PROTOCOL_VERSION;
  address: string;
  contract: Object;
  wsContract: Object;
  token: SecurityToken;
  legacyContractInstance: {
    _tx: (method: Object) => Promise<Object>,
  };

  constructor(
    address: string,
    version?: string = LATEST_PROTOCOL_VERSION,
    token: SecurityToken
  ) {
    const web3Client = Contract._params.web3;
    const web3WsClient = Contract._params.web3WS;
    let artifacts = artifact;
    if (semver.lt(version, LATEST_PROTOCOL_VERSION)) {
      artifacts = artifact2;
      this.version = version;
    }

    // FIXME @RafaelVidaurre: Remove this dependency ASAP, using this for now
    // to quickly get transactions running
    this.legacyContractInstance = new Contract(artifacts, address);
    this.contract = new web3Client.eth.Contract(artifacts.abi, address);
    this.wsContract = new web3WsClient.eth.Contract(artifacts.abi, address);
    this.address = address;
    this.token = token;
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
    if (this.version === LATEST_PROTOCOL_VERSION) return;

    const checksumAddresses = addresses.map(Web3.utils.toChecksumAddress);
    return await this.legacyContractInstance._tx(
      this.contract.methods.changeAccredited(checksumAddresses, statuses),
      null,
      1.15
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
      this.contract.methods.changeNonAccreditedLimit(addresses, limitsInWei),
      null,
      1.15
    );
  }

  _toArray(v: Object): Array<any> {
    const result: Array<any> = [];
    for (let key of Object.keys(v)) {
      result.push(v[key]);
    }
    return result;
  }

  async getDetails(): Promise<USDTieredSTOType> {
    const [
      startTime,
      endTime,
      currentTierRes,
      caps,
      rates,
      fundsRaisedUSD,
      ,
      tokensSoldRes,
      stableFunding,
      isPreMintAllowed,
    ] = this._toArray(await this.contract.methods.getSTODetails().call());
    const [
      paused,
      factoryAddress,
      isOpen,
      isFinalized,
      tiersCount,
      capReached,
    ] = await Promise.all([
      this.paused(),
      this.contract.methods.factory().call(),
      this.contract.methods.isOpen().call(),
      this.contract.methods.isFinalized().call(),
      this.contract.methods.getNumberOfTiers().call(),
      this.contract.methods.capReached().call(),
    ]);

    const currentTier = parseInt(currentTierRes, 10);
    const totalUsdRaised = new BigNumber(
      Web3.utils.fromWei(fundsRaisedUSD.toString())
    );
    const totalTokensSold = new BigNumber(
      Web3.utils.fromWei(tokensSoldRes.toString())
    );

    // Get tiers data
    let tiers = await P.map(range(tiersCount), async tierNumber => {
      const rateRes = rates[tierNumber];
      const totalTokensRes = caps[tierNumber];

      const tokensSoldRes = await this.contract.methods
        .getTokensSoldByTier(tierNumber)
        .call();

      const totalTokens = new BigNumber(Web3.utils.fromWei(totalTokensRes));
      const tokensSold = new BigNumber(Web3.utils.fromWei(tokensSoldRes));
      const rate = new BigNumber(Web3.utils.fromWei(rateRes));
      const totalUsd = totalTokens.times(rate);
      const usdRaised = tokensSold.times(rate);
      let status: USDTieredSTOTierStatus;

      if (tierNumber < currentTier || totalTokens.lte(tokensSold)) {
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
      address: this.address,
      isOpen,
      isTerminated: isFinalized,
      capReached,
      tiers,
      currentTier,
      totalUsdRaised,
      totalTokensSold,
      stableFunding,
      isPreMintAllowed,
    };
  }

  async allowPreMinting(): Promise<Web3Receipt> {
    return await this.legacyContractInstance._tx(
      this.contract.methods.allowPreMinting()
    );
  }

  async revokePreMint(): Promise<Web3Receipt> {
    return await this.legacyContractInstance._tx(
      this.contract.methods.revokePreMintFlag()
    );
  }
}
