import Web3 from 'web3';
import { ModuleRegistryAbi } from '~/LowLevel/abis/ModuleRegistryAbi';
import { Contract } from './Contract';
import { TransactionObject } from 'web3/eth/types';
import { MODULE_TYPES } from './constants';
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

type ModuleType = keyof typeof MODULE_TYPES;

export class ModuleRegistry extends Contract<ModuleRegistryContract> {
  constructor({ address, web3 }: { address: string; web3: Web3 }) {
    super({ address, abi: ModuleRegistryAbi.abi, web3 });
  }

  public async getModulesByTypeAndToken(
    moduleType: ModuleType,
    tokenAddress: string
  ) {
    return this.contract.methods
      .getModulesByTypeAndToken(MODULE_TYPES[moduleType], tokenAddress)
      .call();
  }

  public async getDividendFactoryAddress(
    type: 'POLY' | 'ETH',
    tokenAddress: string
  ) {
    const availableModules = await this.getModulesByTypeAndToken(
      'DIVIDENDS',
      tokenAddress
    );

    availableModules.forEach(moduleAddress => {});
  }

  public async addDividendsModule(type: 'POLY' | 'ETH') {
    const factoryMappings = {
      POLY: 'ERC20DividendCheckpointFactory',
      ETH: 'EthDividendCheckpointFactory',
    };
    const { toHex } = Web3.utils;
    const factoryAddress = await this.contract.toHex(factoryMappings[type]);
    switch (type) {
      case 'POLY':
        factoryName = toHex('ERC20DividendCheckpointFactory');
        break;
      case 'ETH':
        factoryName = toHex('');
    }

    return this.contract.methods.addModule(address, data, maxCost, budget);
  }
}
