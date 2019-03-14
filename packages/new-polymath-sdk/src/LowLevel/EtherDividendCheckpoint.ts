import Web3 from 'web3';
import { EtherDividendCheckpointAbi } from './abis/EtherDividendCheckpointAbi';
import { DividendCheckpoint } from './DividendCheckpoint';
import { toUnixTimestamp, toWei } from './utils';
import { TransactionObject } from 'web3/eth/types';
import { Context } from './LowLevel';
import {
  Dividend,
  GenericContract,
  CreateEtherDividendArgs,
  DividendModuleTypes,
  GetDividendArgs,
} from './types';

// This type should be obtained from a library (must match ABI)
interface EtherDividendCheckpointContract extends GenericContract {
  methods: {
    createDividendWithCheckpointAndExclusions(
      maturity: number,
      expiry: number,
      checkpointId: number,
      excluded: string[],
      name: string
    ): TransactionObject<void>;
    createDividendWithCheckpoint(
      maturity: number,
      expiry: number,
      checkpointId: number,
      name: string
    ): TransactionObject<void>;
  };
}

export class EtherDividendCheckpoint extends DividendCheckpoint<
  EtherDividendCheckpointContract
> {
  public dividendType = DividendModuleTypes.Eth;
  constructor({ address, context }: { address: string; context: Context }) {
    super({ address, abi: EtherDividendCheckpointAbi.abi, context });
  }

  public createDividend = async ({
    maturityDate,
    expiryDate,
    amount,
    checkpointId,
    name,
    excludedAddresses,
  }: CreateEtherDividendArgs) => {
    const [maturity, expiry] = [maturityDate, expiryDate].map(toUnixTimestamp);
    const amountInWei = toWei(amount).valueOf();
    const nameInBytes = Web3.utils.asciiToHex(name);

    if (excludedAddresses) {
      return () =>
        this.contract.methods
          .createDividendWithCheckpointAndExclusions(
            maturity,
            expiry,
            checkpointId,
            excludedAddresses,
            nameInBytes
          )
          .send({ value: amountInWei });
    }

    return () =>
      this.contract.methods
        .createDividendWithCheckpoint(
          maturity,
          expiry,
          checkpointId,
          nameInBytes
        )
        .send({ value: amountInWei });
  };

  public async getDividend({ dividendIndex }: GetDividendArgs) {
    return this._getDividend({ dividendIndex, symbol: 'ETH', decimals: 18 });
  }

  public async getDividends() {
    const dividends = await super.getDividends();

    return dividends.map<Dividend>(dividend => {
      const { currency, ...rest } = dividend;

      return {
        currency: 'ETH',
        ...rest,
      };
    });
  }
}
