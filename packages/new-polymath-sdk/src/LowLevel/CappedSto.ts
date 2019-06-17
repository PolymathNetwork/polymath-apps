import { TransactionObject } from 'web3/eth/types';
import { Context } from './LowLevel';
import { CappedSTOAbi } from './abis/CappedSTOAbi';
import { GenericContract, StoModuleTypes, FundraiseTypes, CappedStoInvestment } from './types';
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
   * cap
   */
  2: string;
  /**
   * rate
   */
  3: string;
  /**
   * raised funds
   */
  4: string;
  /**
   * amount of investors
   */
  5: string;
  /**
   * amount of sold tokens
   */
  6: string;
  /**
   * whether the funds are being raised in POLY (false means ETH)
   */
  7: boolean;
}

interface CappedStoContract extends GenericContract {
  methods: {
    getSTODetails(): TransactionObject<StoDetails>;
  };
}

interface TokenPurchaseEvent {
  purchaser: string;
  beneficiary: string;
  value: string;
  amount: string;
}

export class CappedSto extends Sto<CappedStoContract> {
  public stoType = StoModuleTypes.Capped;

  constructor({ address, context }: { address: string; context: Context }) {
    super({ address, abi: CappedSTOAbi.abi, context });
  }

  public async getDetails() {
    const {
      0: startTime,
      1: endTime,
      2: cap,
      3: rate,
      4: raisedAmount,
      5: investorAmount,
      6: soldTokensAmount,
      7: isPolyFundraise,
    } = await this.contract.methods.getSTODetails().call();

    return {
      startTime: fromUnixTimestamp(parseInt(startTime, 10)),
      endTime: fromUnixTimestamp(parseInt(endTime, 10)),
      cap: fromWei(cap),
      rate: fromWei(rate),
      raisedAmount: fromWei(raisedAmount),
      investorAmount: fromWei(investorAmount),
      soldTokensAmount: fromWei(soldTokensAmount),
      fundraiseTypes: isPolyFundraise ? [FundraiseTypes.Poly] : [FundraiseTypes.Ether],
    };
  }

  public async getInvestments(): Promise<CappedStoInvestment[]> {
    const tokenPurchases = await this.contract.getPastEvents<TokenPurchaseEvent>('TokenPurchase', {
      fromBlock: 'earliest',
      toBlock: 'latest',
    });

    return tokenPurchases.map(({ returnValues: { beneficiary, amount, value } }, index) => ({
      address: beneficiary,
      tokenAmount: fromWei(amount),
      investedFunds: fromWei(value),
      index,
    }));
  }
}
