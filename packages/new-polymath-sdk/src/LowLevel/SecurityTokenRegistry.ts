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
    ): TransactionObject<void>;
    getTickerRegistrationFee(): TransactionObject<string>;
    getSecurityTokenLaunchFee(): TransactionObject<string>;
    getSecurityTokenAddress(ticker: string): TransactionObject<string>;
    generateSecurityToken(
      name: string,
      ticker: string,
      tokenDetails: string,
      divisible: boolean
    ): TransactionObject<void>;
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
      .send({ from: this.context.account });
  }

  public async generateSecurityToken(
    tokenName: string,
    ticker: string,
    tokenDetails: string,
    divisible: boolean
  ) {
    return this.contract.methods
      .generateSecurityToken(tokenName, ticker, tokenDetails, divisible)
      .send({ from: this.context.account });
  }

  public async getTickerRegistrationFee() {
    const feeRes = await this.contract.methods
      .getTickerRegistrationFee()
      .call();
    return new BigNumber(feeRes);
  }

  public async getSecurityTokenLaunchFee() {
    const feeRes = await this.contract.methods
      .getSecurityTokenLaunchFee()
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
