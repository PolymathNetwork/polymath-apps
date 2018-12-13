import { web3 } from './web3Client';

/**
 * Represents a smart contract, addresses should be retrieved before
 * instanciating a class.
 */
export abstract class Contract<T> {
  public address: string;
  protected contract: T;

  constructor({ address, abi }: { address: string; abi: any[] }) {
    this.address = address;
    this.contract = (new web3.eth.Contract(abi, address) as unknown) as T;
  }
}
