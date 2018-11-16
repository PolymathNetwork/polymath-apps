// @flow

import { map } from 'lodash';
import P from 'bluebird';
import { keys, range, compact } from 'lodash';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import Contract from '@polymathnetwork/js';
import USDTieredSTOArtifacts from '@polymathnetwork/shared/fixtures/contracts/USDTieredSTO.json';
import { FUND_RAISE_TYPES, EVENT_TYPES } from '../../constants';

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
        // TODO @RafaelVidaurre: Read from the block it was deploy at
        fromBlock: 0,
        toBlock: 'latest',
      }
    );

    // TODO @RafaelVidaurre: Retrieve token type
    return map(events, event => {
      return {
        investor: event._purchaser,
        receiver: event._beneficiary,
        tokens: new BigNumber(Web3.utils.fromWei(event._tokens)),
        usd: new BigNumber(Web3.utils.fromWei(event._usdAmount)),
        tier: event._tier,
        tierPrice: new BigNumber(Web3.utils.fromWei(event._tierPrice)),
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
    await this.legacyContractInstance._tx(
      this.contract.methods.changeAccredited(addresses, statuses)
    );
  }

  /**
   * Sets individual limits for non-accredited investors
   *
   * @param addresses addresses to update
   * @param limits limits to set for each address matched by index
   */
  async changeNonAccreditedLimit(addresses: string[], limits: BigNumber[]) {
    await this.legacyContractInstance._tx(
      this.contract.methods.changeNonAccreditedLimit(addresses, limits)
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
      totalUsdRaised,
      totalTokensSold,
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
      totalUsdRaised: new BigNumber(Web3.utils.fromWei(totalUsdRaised)),
      totalTokensSold: new BigNumber(Web3.utils.fromWei(totalTokensSold)),
    };
  }
}
