import { TransactionObject } from 'web3/eth/types';
import { PolymathRegistryAbi } from '~/LowLevel/abis/PolymathRegistryAbi';
import { Contract } from './Contract';

interface PolymathRegistryContract {
  methods: {
    getAddress(contractName: string): TransactionObject<string>;
  };
}

export class PolymathRegistry extends Contract<PolymathRegistryContract> {
  constructor({ address }: { address: string }) {
    super({ address, abi: PolymathRegistryAbi.abi });
  }
  public async getAddress(contractName: string): Promise<string> {
    return this.contract.methods.getAddress(contractName).call();
  }
}
