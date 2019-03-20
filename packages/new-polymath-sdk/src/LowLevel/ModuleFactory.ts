import { ModuleFactoryAbi } from './abis/ModuleFactoryAbi';
import { Contract } from './Contract';
import { Context } from './LowLevel';
import { TransactionObject } from 'web3/eth/types';
import { GenericContract } from './types';

// This type should be obtained from a library (must match ABI)
interface ModuleFactoryContract extends GenericContract {
  methods: {
    name(): TransactionObject<string>;
    version(): TransactionObject<string>;
  };
}

export class ModuleFactory extends Contract<ModuleFactoryContract> {
  constructor({ address, context }: { address: string; context: Context }) {
    super({ address, abi: ModuleFactoryAbi.abi, context });
  }

  public async name() {
    return this.contract.methods.name().call();
  }

  public async version() {
    return this.contract.methods.version().call();
  }
}
