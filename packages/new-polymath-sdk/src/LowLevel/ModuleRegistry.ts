import Web3 from 'web3';
import { ModuleRegistryAbi } from './abis/ModuleRegistryAbi';
import { Contract } from './Contract';
import { Context } from './LowLevel';
import { TransactionObject } from 'web3/eth/types';
import { ModuleFactory } from './ModuleFactory';
import { ModuleTypes } from '~/types';
import { GenericContract } from '~/LowLevel/types';

// This type should be obtained from a library (must match ABI)
interface ModuleRegistryContract extends GenericContract {
  methods: {
    getModulesByTypeAndToken(
      moduleType: number,
      tokenAddress: string
    ): TransactionObject<string[]>;
  };
}

export class ModuleRegistry extends Contract<ModuleRegistryContract> {
  constructor({ address, context }: { address: string; context: Context }) {
    super({ address, abi: ModuleRegistryAbi.abi, context });
  }

  public async getModulesByTypeAndToken(
    moduleType: ModuleTypes,
    tokenAddress: string
  ) {
    return this.contract.methods
      .getModulesByTypeAndToken(moduleType, tokenAddress)
      .call();
  }

  /**
   * Retrieve a compatible module's factory address for a given
   * security token
   *
   * @throws an error if there is no compatible module with that name
   */
  public async getModuleFactoryAddress(
    moduleName: string,
    moduleType: ModuleTypes,
    tokenAddress: string
  ) {
    const availableModules = await this.getModulesByTypeAndToken(
      moduleType,
      tokenAddress
    );

    for (const moduleAddress of availableModules) {
      const moduleFactory = new ModuleFactory({
        address: moduleAddress,
        context: this.context,
      });
      const byteName = await moduleFactory.name();
      const name = Web3.utils.toAscii(byteName);

      if (moduleName.localeCompare(name) === 0) {
        return moduleAddress;
      }
    }

    throw new Error(`Module factory for "${moduleName}" was not found.`);
  }
}
