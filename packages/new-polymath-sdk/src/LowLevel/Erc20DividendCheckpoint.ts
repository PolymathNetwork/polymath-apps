import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { ERC20DividendCheckpointAbi } from './abis/ERC20DividendCheckpointAbi';
import { toUnixTimestamp, toWei } from './utils';
import { TransactionObject } from 'web3/eth/types';
import { DividendCheckpoint } from './DividendCheckpoint';
import { Erc20 } from './Erc20';
import { Context } from './LowLevel';
import {
  Dividend,
  GenericContract,
  Erc20DividendDepositedEvent,
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
  };
}

export class Erc20DividendCheckpoint extends DividendCheckpoint<
  Erc20DividendCheckpointContract
> {
  constructor({ address, context }: { address: string; context: Context }) {
    super({ address, abi: ERC20DividendCheckpointAbi.abi, context });
  }

  public createDividend(
    maturityDate: Date,
    expiryDate: Date,
    tokenAddress: string,
    amount: number,
    checkpointId: number,
    name: string,
    excludedAddresses?: string[]
  ) {
    const [maturity, expiry] = [maturityDate, expiryDate].map(toUnixTimestamp);
    const { asciiToHex } = Web3.utils;
    const amountInWei = toWei(amount);
    const nameInBytes = asciiToHex(name);

    if (excludedAddresses) {
      return this.contract.methods
        .createDividendWithCheckpointAndExclusions(
          maturity,
          expiry,
          tokenAddress,
          amountInWei,
          checkpointId,
          excludedAddresses,
          nameInBytes
        )
        .send({ from: this.context.account });
    }

    return this.contract.methods
      .createDividendWithCheckpoint(
        maturity,
        expiry,
        tokenAddress,
        amountInWei,
        checkpointId,
        nameInBytes
      )
      .send({ from: this.context.account });
  }

  public async getDividends() {
    const dividends = await super.getDividends();

    // The currency used for the dividend has to be retrieved from events
    const events = await this.contract.getPastEvents<
      Erc20DividendDepositedEvent
    >('ERC20DividendDeposited', {
      fromBlock: 'genesis',
      toBlock: 'latest',
    });

    const dividendsWithCurrency: Dividend[] = [];

    for (let i = 0; i < dividends.length; i += 1) {
      const dividend = dividends[i];
      const { currency, ...rest } = dividend;
      const depositEvent = events.find(event => {
        const { _dividendIndex } = event.returnValues;
        return _dividendIndex === i;
      });

      if (!depositEvent) {
        dividendsWithCurrency.push(dividend);
        continue;
      }

      const { _token: tokenAddress } = depositEvent.returnValues;

      const token = new Erc20({ address: tokenAddress, context: this.context });

      const symbol = await token.symbol();

      dividendsWithCurrency.push({
        currency: symbol,
        ...rest,
      });
    }

    return dividendsWithCurrency;
  }
}
