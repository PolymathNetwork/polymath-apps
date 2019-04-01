import semver from 'semver';
import { TransactionObject } from 'web3/eth/types';
import { ModuleRegistryAbi } from './abis/ModuleRegistryAbi';
import { Contract } from './Contract';
import { Context } from './LowLevel';
import { ModuleFactory } from './ModuleFactory';
import {
  GenericContract,
  GetModuleFactoryAddressArgs,
  GetModulesByTypeAndTokenArgs,
} from './types';
import { toAscii } from './utils';

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

  public async getModulesByTypeAndToken({
    moduleType,
    tokenAddress,
  }: GetModulesByTypeAndTokenArgs) {
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
  public async getModuleFactoryAddress({
    moduleName,
    moduleType,
    tokenAddress,
  }: GetModuleFactoryAddressArgs) {
    const availableModules = await this.getModulesByTypeAndToken({
      moduleType,
      tokenAddress,
    });

    let address: string | null = null;
    let latestVersion: string = '0.0.0';

    // Get latest version of the module factory
    for (const moduleAddress of availableModules) {
      const moduleFactory = new ModuleFactory({
        address: moduleAddress,
        context: this.context,
      });
      const byteName = await moduleFactory.name();
      const name = toAscii(byteName);

      if (moduleName.localeCompare(name) === 0) {
        const version = await moduleFactory.version();
        if (semver.gte(version, latestVersion)) {
          latestVersion = version;
          address = moduleAddress;
        }
      }
    }

    if (address !== null) {
      return address;
    }

    throw new Error(`Module factory for "${moduleName}" was not found.`);
  }
}
