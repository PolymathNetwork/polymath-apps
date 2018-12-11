import Web3 from 'web3';
import { ModuleFactoryAbi } from '~/LowLevel/abis/ModuleFactoryAbi';
import { Contract } from './Contract';
import { TransactionObject } from 'web3/eth/types';
import BigNumber from 'bignumber.js';
import { runInThisContext } from 'vm';
// This type should be obtained from a library (must match ABI)
interface ModuleFactoryContract {
  methods: {
    name(): TransactionObject<string>;
  };
}

export class ModuleFactory extends Contract<ModuleFactoryContract> {
  constructor({ address, web3 }: { address: string; web3: Web3 }) {
    super({ address, abi: ModuleFactoryAbi.abi, web3 });
  }

  public async name() {
    return this.contract.methods.name().call();
  }
}
