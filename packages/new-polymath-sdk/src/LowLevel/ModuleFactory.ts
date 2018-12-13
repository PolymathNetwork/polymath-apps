import { ModuleFactoryAbi } from '~/LowLevel/abis/ModuleFactoryAbi';
import { Contract } from './Contract';
import { TransactionObject } from 'web3/eth/types';

// This type should be obtained from a library (must match ABI)
interface ModuleFactoryContract {
  methods: {
    name(): TransactionObject<string>;
  };
}

export class ModuleFactory extends Contract<ModuleFactoryContract> {
  constructor({ address }: { address: string }) {
    super({ address, abi: ModuleFactoryAbi.abi });
  }

  public async name() {
    return this.contract.methods.name().call();
  }
}
