import { TransactionObject } from 'web3/eth/types';
import { Contract } from './Contract';
import { Context } from './LowLevel';
import { ERC20Abi } from './abis/ERC20Abi';
import { GenericContract } from '~/LowLevel/types';

interface Erc20Contract extends GenericContract {
  methods: {
    symbol(): TransactionObject<string>;
  };
}

export class Erc20 extends Contract<Erc20Contract> {
  constructor({ address, context }: { address: string; context: Context }) {
    super({ address, abi: ERC20Abi.abi, context });
  }

  public async symbol() {
    return this.contract.methods.symbol().call();
  }
}
