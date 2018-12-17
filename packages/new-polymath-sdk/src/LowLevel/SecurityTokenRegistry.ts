import { TransactionObject } from 'web3/eth/types';
import BigNumber from 'bignumber.js';
import { SecurityTokenRegistryAbi } from './abis/SecurityTokenRegistryAbi';
import { Contract } from './Contract';
import { SecurityToken } from './SecurityToken';
import { Context } from './LowLevel';
import { GenericContract } from '~/LowLevel/types';

interface SecurityTokenRegistryContract extends GenericContract {
  methods: {
    registerTicker(
      owner: string,
      ticker: string,
      tokenName: string
    ): TransactionObject<string>;
    getTickerRegistrationFee(): TransactionObject<string>;
    getSecurityTokenAddress(ticker: string): TransactionObject<string>;
  };
}

export class SecurityTokenRegistry extends Contract<
  SecurityTokenRegistryContract
> {
  constructor({ address, context }: { address: string; context: Context }) {
    super({ address, abi: SecurityTokenRegistryAbi.abi, context });
  }

  public async registerTicker(
    owner: string,
    ticker: string,
    tokenName: string
  ) {
    return this.contract.methods
      .registerTicker(owner, ticker, tokenName)
      .send();
  }

  public async getTickerRegistrationFee() {
    const feeRes = await this.contract.methods
      .getTickerRegistrationFee()
      .call();
    return new BigNumber(feeRes);
  }

  public async getSecurityToken(ticker: string) {
    const address = await this.contract.methods
      .getSecurityTokenAddress(ticker)
      .call();

    return new SecurityToken({ address, context: this.context });
  }
}
