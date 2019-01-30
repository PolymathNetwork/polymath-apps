import { TransactionObject } from 'web3/eth/types';
import { PolymathRegistryAbi } from './abis/PolymathRegistryAbi';
import { Contract } from './Contract';
import { Context } from './LowLevel';
import { GenericContract, GetAddressArgs } from './types';

interface PolymathRegistryContract extends GenericContract {
  methods: {
    getAddress(contractName: string): TransactionObject<string>;
  };
}

export class PolymathRegistry extends Contract<PolymathRegistryContract> {
  constructor({ address, context }: { address: string; context: Context }) {
    super({ address, abi: PolymathRegistryAbi.abi, context });
  }
  public async getAddress({ contractName }: GetAddressArgs): Promise<string> {
    return this.contract.methods.getAddress(contractName).call();
  }
}
