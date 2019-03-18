import { TransactionObject } from 'web3/eth/types';
import { Contract } from './Contract';
import { Context } from './LowLevel';
import { ERC20Abi } from './abis/ERC20Abi';
import {
  GenericContract,
  ApproveArgs,
  AllowanceArgs,
  BalanceOfArgs,
} from './types';
import { fromWei, toWei } from './utils';
import BigNumber from 'bignumber.js';
import { constants } from '@polymathnetwork/new-shared';

interface Erc20Contract extends GenericContract {
  methods: {
    symbol(): TransactionObject<string>;
    approve(address: string, amount: BigNumber): TransactionObject<void>;
    totalSupply(): TransactionObject<number>;
    decimals(): TransactionObject<number>;
    balanceOf(address: string): TransactionObject<number>;
    allowance(tokenOwner: string, spender: string): TransactionObject<number>;
    transfer(address: string, amount: BigNumber): TransactionObject<void>;
    transferFrom(
      from: string,
      to: string,
      amount: BigNumber
    ): TransactionObject<void>;
    decreaseApproval(
      address: string,
      amount: BigNumber
    ): TransactionObject<void>;
    increaseApproval(
      address: string,
      amount: BigNumber
    ): TransactionObject<void>;
  };
}

export class Erc20 extends Contract<Erc20Contract> {
  constructor({ address, context }: { address: string; context: Context }) {
    super({ address, abi: ERC20Abi.abi, context });
  }

  public symbol = async () => {
    let symbol = null;
    try {
      symbol = await this.contract.methods.symbol().call();
    } catch (err) {
      // do nothing
    }

    return symbol;
  };

  public approve = async ({ spender, amount }: ApproveArgs) => {
    const amountInWei = toWei(amount);
    return () =>
      this.contract.methods
        .approve(spender, amountInWei)
        .send({ from: this.context.account });
  };

  public balanceOf = async ({ address }: BalanceOfArgs) => {
    const balance = await this.contract.methods.balanceOf(address).call();

    return fromWei(balance);
  };

  public allowance = async ({ tokenOwner, spender }: AllowanceArgs) => {
    const allowance = await this.contract.methods
      .allowance(tokenOwner, spender)
      .call();

    return fromWei(allowance);
  };

  public isValidErc20 = async () => {
    const { methods } = this.contract;
    const { account } = this.context;

    const zeroValue = new BigNumber(0);
    const { EMPTY_ADDRESS } = constants;

    try {
      await Promise.all([
        methods.totalSupply().call(),
        methods.approve(account, zeroValue).call(),
        methods.allowance(account, EMPTY_ADDRESS).call(),
        methods.transferFrom(EMPTY_ADDRESS, EMPTY_ADDRESS, zeroValue).call(),
        methods.transfer(EMPTY_ADDRESS, zeroValue).call(),
        methods.balanceOf(EMPTY_ADDRESS).call(),
      ]);
    } catch (_err) {
      return false;
    }

    return true;
  };
}
