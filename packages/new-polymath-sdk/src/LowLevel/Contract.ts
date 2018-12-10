import Web3 from 'web3';
import { types } from '@polymathnetwork/new-shared';

/**
 * Represents a smart contract, addresses should be retrieved before
 * instanciating a class.
 */
export abstract class Contract<T> {
  public address: types.Address;
  protected contract: T;

  constructor({
    address,
    web3,
    abi,
  }: {
    address: types.Address;
    web3: Web3;
    abi: any[];
  }) {
    this.address = address;
    this.contract = (new web3.eth.Contract(abi, address) as unknown) as T;
  }
}
