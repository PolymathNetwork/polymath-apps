import Web3 from 'web3';
import Eth from 'web3/eth';
import { types } from '@polymathnetwork/new-shared';
import { PolymathRegistryAbi } from '~/LowLevel/abis/PolymathRegistryAbi';
import { Contract } from './Contract';
import { TransactionObject } from 'web3/eth/types';

// This type should be obtained from a library (must match ABI)
interface PolymathRegistryContract {
  methods: {
    getAddress(contractName: string): TransactionObject<string>;
  };
}

export class PolymathRegistry extends Contract<PolymathRegistryContract> {
  constructor({ address, web3 }: { address: string; web3: Web3 }) {
    super({ address, abi: PolymathRegistryAbi.abi, web3 });
  }
  public async getAddress(contractName: string): Promise<string> {
    return this.contract.methods.getAddress(contractName).call();
  }
}
