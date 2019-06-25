import { TransactionObject } from 'web3/eth/types';
import { Module } from './Module';
import { Context } from './LowLevel';
import { GenericContract, StoModuleTypes } from './types';
import { getOptions } from './utils';

// This type should be obtained from a library (must match ABI)
interface StoContract<T extends GenericContract> {
  methods: {
    paused(): TransactionObject<boolean>;
    capReached(): TransactionObject<boolean>;
    pause(): TransactionObject<void>;
  } & T['methods'];
  getPastEvents: T['getPastEvents'];
}

export abstract class Sto<T extends GenericContract = GenericContract> extends Module<
  StoContract<T>
> {
  public abstract stoType: StoModuleTypes;

  constructor({ address, abi, context }: { address: string; abi: any[]; context: Context }) {
    super({ address, abi, context });
  }

  public paused = async () => {
    return await this.contract.methods.paused().call();
  };

  public capReached = async () => {
    return await this.contract.methods.capReached().call();
  };

  public pause = async () => {
    const method = this.contract.methods.pause();
    const options = await getOptions(method, { from: this.context.account });
    return () => method.send(options);
  };
}
