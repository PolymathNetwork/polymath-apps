import Web3 from 'web3';
import Eth from 'web3/eth';
import { types, contracts } from '@polymathnetwork/new-shared';
import { Contract } from './Contract';

// This type should be obtained from a library (must match ABI)
interface PolymathRegistryType {
  getAddress(contractName: string): types.Address;
}

export class PolymathRegistry extends Contract<PolymathRegistry> {
  constructor({ address, web3 }: { address: string; web3: Web3 }) {
    super({ address, abi: contracts.PolymathRegistry, web3 });
  }
  public getAddress(contractName: string): string {
    return this.contract.getAddress.call(contractName);
  }
}
