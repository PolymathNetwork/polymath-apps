import { TransactionObject } from 'web3/eth/types';
import { Context } from './LowLevel';
import { USDTieredSTOAbi } from './abis/USDTieredSTOAbi';
import { GenericContract, StoModuleTypes, FundraiseTypes, UsdTieredStoInvestment } from './types';
import { fromUnixTimestamp, fromWei } from './utils';
import { Sto } from './Sto';

interface StoDetails {
  /**
   * start time
   */
  0: string;
  /**
   * end time
   */
  1: string;
  /**
   * current tier
   */
  2: string;
  /**
   * cap per tier
   */
  3: string[];
  /**
   * rate per tier
   */
  4: string[];
  /**
   * raised funds
   */
  5: string;
  /**
   * amount of investors
   */
  6: string;
  /**
   * amount of sold tokens
   */
  7: string;
  /**
   * whether the funds are being raised in ETH, POLY and/or Stablecoins
   */
  8: boolean[];
}

interface UsdTieredStoContract extends GenericContract {
  methods: {
    getSTODetails(): TransactionObject<StoDetails>;
  };
}

interface TokenPurchaseEvent {
  purchaser: string;
  beneficiary: string;
  tokens: string;
  usdAmount: string;
  tierPrice: string;
  tier: string;
}

export class UsdTieredSto extends Sto<UsdTieredStoContract> {
  public stoType = StoModuleTypes.UsdTiered;

  constructor({ address, context }: { address: string; context: Context }) {
    super({ address, abi: USDTieredSTOAbi.abi, context });
  }

  public async getDetails() {
    const {
      0: startTime,
      1: endTime,
      2: currentTier,
      3: tokensPerTier,
      4: ratesPerTier,
      5: raisedAmount,
      6: investorAmount,
      7: soldTokensAmount,
      8: fundraiseTypes,
    } = await this.contract.methods.getSTODetails().call();

    const types = [];

    if (fundraiseTypes[0]) {
      types.push(FundraiseTypes.Ether);
    }

    if (fundraiseTypes[1]) {
      types.push(FundraiseTypes.Poly);
    }

    if (fundraiseTypes[2]) {
      types.push(FundraiseTypes.Usd);
    }

    return {
      startTime: fromUnixTimestamp(parseInt(startTime, 10)),
      endTime: fromUnixTimestamp(parseInt(endTime, 10)),
      currentTier: parseInt(currentTier, 10),
      tokensPerTier: tokensPerTier.map(cap => fromWei(cap)),
      ratesPerTier: ratesPerTier.map(rate => fromWei(rate)),
      raisedAmount: fromWei(raisedAmount),
      investorAmount: fromWei(investorAmount),
      soldTokensAmount: fromWei(soldTokensAmount),
      fundraiseTypes: types,
    };
  }

  public async getInvestments(): Promise<UsdTieredStoInvestment[]> {
    const tokenPurchases = await this.contract.getPastEvents<TokenPurchaseEvent>('TokenPurchase', {
      fromBlock: 'earliest',
      toBlock: 'latest',
    });

    return tokenPurchases.map(({ returnValues: { beneficiary, tokens, usdAmount } }, index) => ({
      address: beneficiary,
      tokenAmount: fromWei(tokens),
      investedFunds: fromWei(usdAmount),
      index,
    }));
  }
}
