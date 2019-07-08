import { TransactionObject } from 'web3/eth/types';
import { GenericContract } from '../types';
import { Context } from '../LowLevel';
import { Contract } from '../Contract';

interface StubContract extends GenericContract {
  methods: {
    getVersion(): TransactionObject<number[]>;
  };
}

export class Stub extends Contract<StubContract> {
  constructor({ address, abi, context }: { address: string; abi: any; context: Context }) {
    super({ address, abi, context });
  }

  public getVersion = () => {
    return this.contract.methods.getVersion().call();
  };
}
