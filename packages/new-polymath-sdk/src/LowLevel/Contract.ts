import { web3 } from './web3Client';
import { Context } from './LowLevel';
import { GenericContract } from './types';

/**
 * Represents a smart contract, addresses should be retrieved before
 * instantiating a class.
 */
export abstract class Contract<T extends GenericContract> {
  public address: string;
  protected contract: T;
  protected context: Context;

  constructor({
    address,
    abi,
    context,
  }: {
    address: string;
    abi: any[];
    context: Context;
  }) {
    this.address = address;
    this.context = context;
    this.contract = (new web3.eth.Contract(abi, address) as unknown) as T;
  }
}
