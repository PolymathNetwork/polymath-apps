import { ModuleFactoryAbi } from './abis/ModuleFactoryAbi';
import { Contract } from './Contract';
import { Context } from './LowLevel';
import { TransactionObject } from 'web3/eth/types';
import { GenericContract } from '~/LowLevel/types';

// This type should be obtained from a library (must match ABI)
interface ModuleFactoryContract extends GenericContract {
  methods: {
    name(): TransactionObject<string>;
  };
}

export class ModuleFactory extends Contract<ModuleFactoryContract> {
  constructor({ address, context }: { address: string; context: Context }) {
    super({ address, abi: ModuleFactoryAbi.abi, context });
  }

  public async name() {
    return this.contract.methods.name().call();
  }
}
