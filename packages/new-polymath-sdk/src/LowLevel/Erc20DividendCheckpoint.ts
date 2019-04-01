import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { ERC20DividendCheckpointAbi } from './abis/ERC20DividendCheckpointAbi';
import { toUnixTimestamp, toDivisible } from './utils';
import { TransactionObject } from 'web3/eth/types';
import { DividendCheckpoint } from './DividendCheckpoint';
import { Erc20 } from './Erc20';
import { Context } from './LowLevel';
import {
  Dividend,
  GenericContract,
  CreateErc20DividendArgs,
  DividendModuleTypes,
  GetDividendArgs,
} from './types';

// This type should be obtained from a library (must match ABI)
interface Erc20DividendCheckpointContract extends GenericContract {
  methods: {
    createDividendWithCheckpointAndExclusions(
      maturity: number,
      expiry: number,
      tokenAddress: string,
      amount: BigNumber,
      checkpointId: number,
      excluded: string[],
      name: string
    ): TransactionObject<void>;
    createDividendWithCheckpoint(
      maturity: number,
      expiry: number,
      tokenAddress: string,
      amount: BigNumber,
      checkpointId: number,
      name: string
    ): TransactionObject<void>;
    dividendTokens(dividendIndex: number): TransactionObject<string>;
  };
}

export class Erc20DividendCheckpoint extends DividendCheckpoint<
  Erc20DividendCheckpointContract
> {
  public dividendType = DividendModuleTypes.Erc20;
  constructor({ address, context }: { address: string; context: Context }) {
    super({ address, abi: ERC20DividendCheckpointAbi.abi, context });
  }

  public createDividend = async ({
    maturityDate,
    expiryDate,
    tokenAddress,
    amount,
    checkpointId,
    name,
    excludedAddresses,
  }: CreateErc20DividendArgs) => {
    const [maturity, expiry] = [maturityDate, expiryDate].map(toUnixTimestamp);
    const { asciiToHex } = Web3.utils;

    const token = this.context.getErc20Token({ address: tokenAddress });
    const decimals = await token.decimals();

    const nameInBytes = asciiToHex(name);
    const divisibleAmount = toDivisible(amount, decimals);

    if (excludedAddresses) {
      return () =>
        this.contract.methods
          .createDividendWithCheckpointAndExclusions(
            maturity,
            expiry,
            tokenAddress,
            divisibleAmount,
            checkpointId,
            excludedAddresses,
            nameInBytes
          )
          .send({ from: this.context.account });
    }

    return () =>
      this.contract.methods
        .createDividendWithCheckpoint(
          maturity,
          expiry,
          tokenAddress,
          divisibleAmount,
          checkpointId,
          nameInBytes
        )
        .send({ from: this.context.account });
  };

  public async getDividend({
    dividendIndex,
  }: GetDividendArgs): Promise<Dividend> {
    const tokenAddress = await this.contract.methods
      .dividendTokens(dividendIndex)
      .call();

    const token = new Erc20({ address: tokenAddress, context: this.context });

    const symbol = await token.symbol();
    const decimals = await token.decimals();

    return this._getDividend({ dividendIndex, symbol, decimals });
  }
}
