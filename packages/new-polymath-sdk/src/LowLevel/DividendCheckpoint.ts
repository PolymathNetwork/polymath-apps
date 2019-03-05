import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { Module } from './Module';
import { Context } from './LowLevel';
import { TransactionObject } from 'web3/eth/types';
import { SecurityToken } from './SecurityToken';
import {
  GenericContract,
  Dividend,
  SetWithholdingArgs,
  ReclaimDividendArgs,
  WithdrawWithholdingArgs,
  GetTaxWithholdingListArgs,
  PushDividendPaymentArgs,
  GetDividendInvestorsArgs,
  GetDividendsByCheckpointArgs,
  GetDividendArgs,
  SetDividendsWalletArgs,
} from './types';
import { fromUnixTimestamp, fromWei, toWei } from './utils';
import { TaxWithholding, DividendModuleTypes } from './types';
import { zipWith } from 'lodash';

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

interface CheckpointData {
  /**
   * investor addresses
   */
  0: string[];
  /**
   * balances
   */
  1: string[];
  /**
   * percentages
   */
  2: number[];
}

interface DividendProgress {
  /**
   * investor addresses
   */
  0: string[];
  /**
   * payment status
   */
  1: boolean[];
  /**
   * exclusion status
   */
  2: boolean[];
  /**
   * withheld tax amount
   */
  3: number[];
  /**
   * paid amount
   */
  4: number[];
  /**
   * token balances of investors
   */
  5: number[];
}

// This type should be obtained from a library (must match ABI)
interface DividendCheckpointContract<T extends GenericContract> {
  methods: {
    getCheckpointData(checkpointId: number): TransactionObject<CheckpointData>;
    getDividendIndex(checkpointId: number): TransactionObject<number[]>;
    getDividendProgress(
      dividendIndex: number
    ): TransactionObject<DividendProgress>;
    dividends(index: number): TransactionObject<InternalDividend>;
    setWithholding(
      investors: string[],
      percentages: BigNumber[]
    ): TransactionObject<void>;
    reclaimDividend(dividendIndex: number): TransactionObject<void>;
    withdrawWithholding(dividendIndex: number): TransactionObject<void>;
    pushDividendPaymentToAddresses(
      dividendIndex: number,
      investorAddresses: string[]
    ): TransactionObject<void>;
    changeWallet(wallet: string): TransactionObject<void>;
  } & T['methods'];
  getPastEvents: T['getPastEvents'];
}

export abstract class DividendCheckpoint<
  T extends GenericContract = GenericContract
> extends Module<DividendCheckpointContract<T>> {
  public abstract dividendType: DividendModuleTypes;
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

  public async getTaxWithholdingList({
    checkpointIndex,
  }: GetTaxWithholdingListArgs): Promise<TaxWithholding[]> {
    const {
      0: investors,
      2: percentages,
    } = await this.contract.methods.getCheckpointData(checkpointIndex).call();

    return zipWith(investors, percentages, (address, percentage) => ({
      address,
      percentage,
    }));
  }

  public async getInvestors({ dividendIndex }: GetDividendInvestorsArgs) {
    const { 0: investors } = await this.contract.methods
      .getDividendProgress(dividendIndex)
      .call();

    return investors;
  }

  public async getDividend({
    dividendIndex,
  }: GetDividendArgs): Promise<Dividend> {
    const { methods } = this.contract;
    const dividend = await this.contract.methods
      .dividends(dividendIndex)
      .call();

    const {
      0: addresses,
      1: claimedPayments,
      2: exclusions,
      3: withheldTaxes,
      4: paidAmounts,
      5: balances,
    } = await methods.getDividendProgress(dividendIndex).call();

    // NOTE @monitz87: this is done like this because lodash's zipWith function doesn't
    // support more than 5 arrays in its type definition
    const investors = [];

    for (let i = 0; i < addresses.length; i += 1) {
      investors.push({
        address: addresses[i],
        paymentReceived: claimedPayments[i],
        excluded: exclusions[i],
        withheldTax: fromWei(withheldTaxes[i]),
        amountReceived: fromWei(paidAmounts[i]),
        balance: fromWei(balances[i]),
      });
    }

    const { toAscii } = Web3.utils;

    const {
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
      index: dividendIndex,
      checkpointId,
      dividendType: this.dividendType,
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
      investors,
    };
  }

  public async getDividendsByCheckpoint({
    checkpointIndex,
  }: GetDividendsByCheckpointArgs) {
    const dividendIndexes = await this.contract.methods
      .getDividendIndex(checkpointIndex)
      .call();

    const dividends = [];
    for (const dividendIndex of dividendIndexes) {
      const dividend = await this.getDividend({ dividendIndex });

      dividends.push(dividend);
    }

    return dividends;
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
      const dividend = await this.getDividendsByCheckpoint({
        checkpointIndex: checkpointId,
      });

      dividends.push(...dividend);
    }

    return dividends;
  }

  public setWithholding = async ({
    investors,
    percentages,
  }: SetWithholdingArgs) => {
    const percentagesInWei = percentages.map(toWei);

    return () =>
      this.contract.methods
        .setWithholding(investors, percentagesInWei)
        .send({ from: this.context.account });
  };

  public reclaimDividend = async ({ dividendIndex }: ReclaimDividendArgs) => {
    return () =>
      this.contract.methods
        .reclaimDividend(dividendIndex)
        .send({ from: this.context.account });
  };

  public withdrawWithholding = async ({
    dividendIndex,
  }: WithdrawWithholdingArgs) => {
    return () =>
      this.contract.methods
        .withdrawWithholding(dividendIndex)
        .send({ from: this.context.account });
  };

  public pushDividendPayment = async ({
    dividendIndex,
    investorAddresses,
  }: PushDividendPaymentArgs) => {
    return () =>
      this.contract.methods
        .pushDividendPaymentToAddresses(dividendIndex, investorAddresses)
        .send({ from: this.context.account });
  };

  public setWallet = async ({ address }: SetDividendsWalletArgs) => {
    return () =>
      this.contract.methods
        .changeWallet(address)
        .send({ from: this.context.account });
  };
}
