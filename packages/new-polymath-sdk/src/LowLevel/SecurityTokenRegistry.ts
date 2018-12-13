import { TransactionObject } from 'web3/eth/types';
import BigNumber from 'bignumber.js';
import { SecurityTokenRegistryAbi } from '~/LowLevel/abis/SecurityTokenRegistryAbi';
import { Contract } from './Contract';

interface SecurityTokenRegistryContract {
  methods: {
    registerTicker(
      owner: string,
      ticker: string,
      tokenName: string
    ): TransactionObject<string>;
    getTickerRegistrationFee(): TransactionObject<string>;
  };
}

export class SecurityTokenRegistry extends Contract<
  SecurityTokenRegistryContract
> {
  constructor({ address }: { address: string }) {
    super({ address, abi: SecurityTokenRegistryAbi.abi });
  }

  public registerTicker(owner: string, ticker: string, tokenName: string) {
    return this.contract.methods.registerTicker(owner, ticker, tokenName);
  }

  public async getTickerRegistrationFee() {
    const feeRes = await this.contract.methods
      .getTickerRegistrationFee()
      .call();
    return new BigNumber(feeRes);
  }
}
