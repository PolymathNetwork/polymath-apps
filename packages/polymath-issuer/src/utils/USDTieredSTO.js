import P from 'bluebird';
import { keys, range, compact } from 'lodash';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import Contract from '@polymathnetwork/js';
import USDTieredSTOArtifacts from '@polymathnetwork/shared/fixtures/contracts/USDTieredSTO.json';
import { FUND_RAISE_TYPES } from '../constants';

type Details = {|
  address: string,
  start: Date,
  end: Date,
  type: STOModuleType,
|};

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

  async paused(): boolean {
    return await this.contract.methods.paused().call();
  }

  async getDetails(): Details {
    // TODO: Find better way. Also paralellize
    const startTime = await this.contract.methods.startTime().call();
    const endTime = await this.contract.methods.endTime().call();
    const paused = await this.paused();
    const totalUsdRaised = await this.contract.methods.fundsRaisedUSD().call();
    const factoryAddress = await this.contract.methods.factory().call();
    const open = await this.contract.methods.isOpen().call();
    const finalized = await this.contract.methods.isFinalized().call();
    const tiersCount = await this.contract.methods.getNumberOfTiers().call();

    const totalTokensSold = await this.contract.methods.getTokensSold().call();

    // // Fund raise types
    let raiseTypes = await P.map(keys(FUND_RAISE_TYPES), async raiseType => {
      const raiseTypeId = FUND_RAISE_TYPES[raiseType];
      console.log('raiseType', raiseType);
      const usesType = await this.contract.methods
        .fundRaiseTypes(raiseTypeId)
        .call();
      if (usesType) {
        return raiseType;
      }
    });

    raiseTypes = compact(raiseTypes);

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

      const rate = parseFloat(rateRes, 10);
      const totalUsd = totalTokens.times(rate).toNumber();
      const usdRaised = tokensSold.times(rate).toNumber();

      return {
        rate,
        tokensSold,
        totalTokens,
        totalUsd,
        usdRaised,
      };
    });

    return {
      startDate: new Date(startTime * 1000),
      endDate: new Date(endTime * 1000),
      paused,
      type: 'USDTieredSTO',
      factoryAddress,
      open,
      finalized,
      raiseTypes,
      tiers,
      totalUsdRaised,
      tokensSold: new BigNumber(Web3.utils.fromWei(totalTokensSold)),
    };
  }
}
