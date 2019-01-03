import BigNumber from 'bignumber.js';
import { TransactionObject } from 'web3/eth/types';
import { PolyTokenAbi } from './abis/PolyTokenAbi';
import { PolyTokenFaucetAbi } from './abis/PolyTokenFaucetAbi';
import { Contract } from './Contract';
import { Context } from './LowLevel';
import { GenericContract } from '~/LowLevel/types';

interface PolyTokenContract extends GenericContract {
  methods: {
    getTokens: (
      amount: BigNumber,
      recipient: string
    ) => TransactionObject<boolean>;
    balanceOf: (address: string) => TransactionObject<string>;
    allowance: (
      tokenOwner: string,
      spender: string
    ) => TransactionObject<string>;
    approve: (spender: string, amount: BigNumber) => TransactionObject<boolean>;
  };
}

export class PolyToken extends Contract<PolyTokenContract> {
  private isTestnet: boolean;

  constructor({ address, context }: { address: string; context: Context }) {
    const isTestnet = context.isTestnet();
    const abi = isTestnet ? PolyTokenFaucetAbi.abi : PolyTokenAbi.abi;
    super({ address, abi, context });
    this.isTestnet = isTestnet;
  }

  public async getTokens(amount: BigNumber, recipient: string) {
    if (!this.isTestnet) {
      throw new Error('Cannot call "getTokens" in mainnet');
    }
    return this.contract.methods
      .getTokens(amount, recipient)
      .send({ from: this.context.account });
  }

  public async balanceOf(address: string) {
    return this.contract.methods.balanceOf(address).call();
  }

  public async allowance(tokenOwner: string, spender: string) {
    return this.contract.methods.allowance(tokenOwner, spender).call();
  }

  public async approve(spender: string, amount: BigNumber) {
    return this.contract.methods
      .approve(spender, amount)
      .send({ from: this.context.account });
  }
}
