import Web3 from 'web3';
import { ModuleRegistryAbi } from '~/LowLevel/abis/ModuleRegistryAbi';
import { Contract } from './Contract';
import { TransactionObject } from 'web3/eth/types';
import { ModuleFactory } from '~/LowLevel/ModuleFactory';
import { ModuleTypes } from '~/types';
import BigNumber from 'bignumber.js';

// This type should be obtained from a library (must match ABI)
interface ModuleRegistryContract {
  methods: {
    getModulesByTypeAndToken(
      moduleType: number,
      tokenAddress: string
    ): TransactionObject<string[]>;
  };
}

export class ModuleRegistry extends Contract<ModuleRegistryContract> {
  constructor({ address }: { address: string }) {
    super({ address, abi: ModuleRegistryAbi.abi });
  }

  public async getModulesByTypeAndToken(
    moduleType: ModuleTypes,
    tokenAddress: string
  ) {
    return this.contract.methods
      .getModulesByTypeAndToken(moduleType, tokenAddress)
      .call();
  }

  public async getDividendFactoryAddress(
    type: 'POLY' | 'ETH',
    tokenAddress: string
  ) {
    const availableModules = await this.getModulesByTypeAndToken(
      ModuleTypes.Dividends,
      tokenAddress
    );

    availableModules.forEach(moduleAddress => {});
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
      });

      const name = Web3.utils.toAscii(await moduleFactory.name());

      if (name === moduleName) {
        return moduleAddress;
      }
    }

    throw new Error(`Module factory for "${moduleName}" was not found.`);
  }
}
