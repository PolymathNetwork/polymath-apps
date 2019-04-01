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
import {
  fromUnixTimestamp,
  fromWei,
  toWei,
  fromDivisible,
  toAscii,
} from './utils';
import { TaxWithholding, DividendModuleTypes } from './types';
import { zipWith, range, flatten } from 'lodash';

interface InternalDividend {
  checkpointId: string;
  created: string;
  maturity: string;
  expiry: string;
  amount: string;
  claimedAmount: string;
  totalSupply: string;
  reclaimed: boolean;
  totalWithheld: string;
  totalWithheldWithdrawn: string;
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
  2: string[];
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
  3: string[];
  /**
   * paid amount
   */
  4: string[];
  /**
   * token balances of investors
   */
  5: string[];
}

// This type should be obtained from a library (must match ABI)
interface DividendCheckpointContract<T extends GenericContract> {
  methods: {
    getCheckpointData(checkpointId: number): TransactionObject<CheckpointData>;
    getDividendIndex(checkpointId: number): TransactionObject<string[]>;
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
    wallet(): TransactionObject<string>;
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
      percentage: fromWei(percentage).toNumber(),
    }));
  }

  public async getInvestors({ dividendIndex }: GetDividendInvestorsArgs) {
    const { 0: investors } = await this.contract.methods
      .getDividendProgress(dividendIndex)
      .call();

    return investors;
  }

  public async fromDivisible(value: string) {
    return fromDivisible(value, 18);
  }

  public abstract getDividend({
    dividendIndex,
  }: GetDividendArgs): Promise<Dividend>;

  public async getDividendsByCheckpoint({
    checkpointIndex,
  }: GetDividendsByCheckpointArgs) {
    const dividendIndexes = await this.contract.methods
      .getDividendIndex(checkpointIndex)
      .call();

    const dividends = await Promise.all(
      dividendIndexes.map(dividendIndex =>
        this.getDividend({ dividendIndex: parseInt(dividendIndex, 10) })
      )
    );

    return dividends.sort((a, b) => a.index - b.index);
  }

  public async getDividends() {
    const stAddress = await this.securityTokenAddress();
    const securityToken = new SecurityToken({
      address: stAddress,
      context: this.context,
    });

    const currentCheckpointIndex = await securityToken.currentCheckpointId();
    const checkpointIndexes = range(1, currentCheckpointIndex + 1);
    const dividends = await Promise.all(
      checkpointIndexes.map(checkpointIndex =>
        this.getDividendsByCheckpoint({ checkpointIndex })
      )
    );

    return flatten(dividends).sort((a, b) => a.index - b.index);
  }

  public getStorageWallet = async () => {
    return this.contract.methods.wallet().call();
  };

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

  protected async _getDividend({
    dividendIndex,
    symbol,
    decimals,
  }: GetDividendArgs & {
    symbol: string | null;
    decimals: number;
  }): Promise<Dividend> {
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
        withheldTax: fromDivisible(withheldTaxes[i], decimals),
        amountReceived: fromDivisible(paidAmounts[i], decimals),
        balance: fromWei(balances[i]),
      });
    }

    const {
      checkpointId,
      created,
      maturity,
      expiry,
      amount,
      claimedAmount,
      totalSupply,
      reclaimed,
      totalWithheld,
      totalWithheldWithdrawn,
      name,
    } = dividend;

    return {
      index: dividendIndex,
      checkpointId: parseInt(checkpointId, 10),
      dividendType: this.dividendType,
      created: fromUnixTimestamp(parseInt(created, 10)),
      maturity: fromUnixTimestamp(parseInt(maturity, 10)),
      expiry: fromUnixTimestamp(parseInt(expiry, 10)),
      amount: fromDivisible(amount, decimals),
      claimedAmount: fromDivisible(claimedAmount, decimals),
      totalSupply: fromWei(totalSupply),
      reclaimed,
      totalWithheld: fromDivisible(totalWithheld, decimals),
      totalWithheldWithdrawn: fromDivisible(totalWithheldWithdrawn, decimals),
      name: toAscii(name),
      currency: symbol,
      investors,
    };
  }
}
