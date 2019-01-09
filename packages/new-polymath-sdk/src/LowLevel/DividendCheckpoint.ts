import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { Module } from './Module';
import { Context } from './LowLevel';
import { TransactionObject } from 'web3/eth/types';
import { SecurityToken } from './SecurityToken';
import { GenericContract, Dividend } from './types';
import { fromUnixTimestamp, fromWei, toWei } from './utils';

interface InternalDividend {
  checkpointId: number;
  created: number;
  maturity: number;
  expiry: number;
  amount: number;
  claimedAmount: number;
  totalSupply: number;
  reclaimed: boolean;
  dividendWithheld: number;
  dividendWithheldReclaimed: number;
  name: string;
}

// This type should be obtained from a library (must match ABI)
interface DividendCheckpointContract<T extends GenericContract> {
  methods: {
    getDividendIndex(checkpointId: number): TransactionObject<number[]>;
    dividends(index: number): TransactionObject<InternalDividend>;
    setWithholding(
      investors: string[],
      percentages: BigNumber[]
    ): TransactionObject<void>;
    reclaimDividend(dividendIndex: number): TransactionObject<void>;
    withdrawWithholding(dividendIndex: number): TransactionObject<void>;
  } & T['methods'];
  getPastEvents: T['getPastEvents'];
}

export class DividendCheckpoint<
  T extends GenericContract = GenericContract
> extends Module<DividendCheckpointContract<T>> {
  constructor({
    address,
    abi,
    context,
  }: {
    address: string;
    abi: any[];
    context: Context;
  }) {
    super({ address, abi, context });
  }

  public async getDividends() {
    const stAddress = await this.securityTokenAddress();
    const securityToken = new SecurityToken({
      address: stAddress,
      context: this.context,
    });

    const currentCheckpointId = await securityToken.currentCheckpointId();

    const dividends = [];

    for (
      let checkpointId = 1;
      checkpointId <= currentCheckpointId;
      ++checkpointId
    ) {
      const dividendIndexes = await this.contract.methods
        .getDividendIndex(checkpointId)
        .call();

      for (const dividendIndex of dividendIndexes) {
        const dividend = await this.contract.methods
          .dividends(dividendIndex)
          .call();

        dividends.push({
          index: dividendIndex,
          ...dividend,
        });
      }
    }

    const { toAscii } = Web3.utils;

    return dividends.map(
      (dividend): Dividend => {
        const {
          index,
          checkpointId,
          created,
          maturity,
          expiry,
          amount,
          claimedAmount,
          totalSupply,
          reclaimed,
          dividendWithheld,
          dividendWithheldReclaimed,
          name,
        } = dividend;

        return {
          index,
          checkpointId,
          created: fromUnixTimestamp(created),
          maturity: fromUnixTimestamp(maturity),
          expiry: fromUnixTimestamp(expiry),
          amount: fromWei(amount),
          claimedAmount: fromWei(claimedAmount),
          totalSupply: fromWei(totalSupply),
          reclaimed,
          dividendWithheld: fromWei(dividendWithheld),
          dividendWithheldReclaimed: fromWei(dividendWithheldReclaimed),
          name: toAscii(name),
          currency: null,
        };
      }
    );
  }

  public setWithholding(investors: string[], percentages: number[]) {
    const percentagesInWei = percentages.map(toWei);
    return this.contract.methods
      .setWithholding(investors, percentagesInWei)
      .send({ from: this.context.account });
  }

  public async reclaimDividend(dividendIndex: number) {
    return this.contract.methods
      .reclaimDividend(dividendIndex)
      .send({ from: this.context.account });
  }

  public async withdrawWithholding(dividendIndex: number) {
    return this.contract.methods
      .withdrawWithholding(dividendIndex)
      .send({ from: this.context.account });
  }
}
