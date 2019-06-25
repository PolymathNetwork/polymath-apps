import BigNumber from 'bignumber.js';
import { TransactionObject } from 'web3/eth/types';
import { PolyTokenAbi } from './abis/PolyTokenAbi';
import { PolyTokenFaucetAbi } from './abis/PolyTokenFaucetAbi';
import { Contract } from './Contract';
import { Context } from './LowLevel';
import { fromWei, toWei, getOptions } from './utils';

import { GenericContract, AllowanceArgs, GetTokensArgs, BalanceOfArgs, ApproveArgs } from './types';

interface PolyTokenContract extends GenericContract {
  methods: {
    getTokens: (amount: BigNumber, recipient: string) => TransactionObject<void>;
    balanceOf: (address: string) => TransactionObject<string>;
    allowance: (tokenOwner: string, spender: string) => TransactionObject<string>;
    approve: (spender: string, amount: BigNumber) => TransactionObject<void>;
  };
}

export class PolyToken extends Contract<PolyTokenContract> {
  private isTestnet: boolean;

  constructor({ address, context }: { address: string; context: Context }) {
    super({
      address,
      abi: context.isTestnet() ? PolyTokenFaucetAbi.abi : PolyTokenAbi.abi,
      context,
    });
    this.isTestnet = context.isTestnet();
    this.getTokens = this.getTokens.bind(this);
    this.approve = this.approve.bind(this);
  }

  public getTokens = async ({ amount, recipient }: GetTokensArgs) => {
    if (!this.isTestnet) {
      throw new Error('Cannot call "getTokens" in mainnet');
    }
    const amountInWei = toWei(amount);

    const method = this.contract.methods.getTokens(amountInWei, recipient);
    const options = await getOptions(method, { from: this.context.account });
    return () => method.send(options);
  };

  public balanceOf = async ({ address }: BalanceOfArgs) => {
    const balance = await this.contract.methods.balanceOf(address).call();

    return fromWei(balance);
  };

  public allowance = async ({ tokenOwner, spender }: AllowanceArgs) => {
    const allowance = await this.contract.methods.allowance(tokenOwner, spender).call();

    return fromWei(allowance);
  };

  public approve = async ({ spender, amount, owner }: ApproveArgs) => {
    const amountInWei = toWei(amount);
    let ownerAddress: string;

    const { account } = this.context;

    if (owner) {
      ownerAddress = owner;
    } else if (account) {
      ownerAddress = account;
    } else {
      throw new Error("No default account set. You must pass the owner's address as a parameter");
    }

    const method = this.contract.methods.approve(spender, amountInWei);
    const options = await getOptions(method, { from: ownerAddress });

    return () => method.send(options);
  };

  public symbol = async () => {
    return 'POLY';
  };
}
