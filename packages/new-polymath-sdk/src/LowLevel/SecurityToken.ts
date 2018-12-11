import Web3 from 'web3';
import { SecurityTokenAbi } from '~/LowLevel/abis/SecurityTokenAbi';
import { Contract } from './Contract';
import { TransactionObject } from 'web3/eth/types';
import BigNumber from 'bignumber.js';
import { runInThisContext } from 'vm';
// This type should be obtained from a library (must match ABI)
interface SecurityTokenContract {
  methods: {
    createCheckpoint(): TransactionObject<number>;
    addModule(
      address: string,
      data: string,
      maxCost: BigNumber,
      budget: BigNumber
    ): TransactionObject<void>;
  };
}

export class SecurityToken extends Contract<SecurityTokenContract> {
  constructor({ address, web3 }: { address: string; web3: Web3 }) {
    super({ address, abi: SecurityTokenAbi.abi, web3 });
  }

  public async createCheckpoint() {
    return this.contract.methods.createCheckpoint();
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
