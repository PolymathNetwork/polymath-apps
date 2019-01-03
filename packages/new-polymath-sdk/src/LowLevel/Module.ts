import { Contract } from './Contract';
import { Context } from './LowLevel';
import { TransactionObject } from 'web3/eth/types';
import { GenericContract } from './types';

// This type should be obtained from a library (must match ABI)
interface ModuleContract<T extends GenericContract> {
  methods: {
    securityToken(): TransactionObject<string>;
  } & T['methods'];
  getPastEvents: T['getPastEvents'];
}

export class Module<T extends GenericContract> extends Contract<
  ModuleContract<T>
> {
  protected tokenAddress: string | null = null;

  constructor({
    address,
    abi,
    context,
  }: {
    address: string;
    abi: any[];
    context: Context;
  }) {
    super({ address, abi, context });
  }

  public async securityTokenAddress() {
    if (!this.tokenAddress) {
      this.tokenAddress = await this.contract.methods.securityToken().call();
    }

    return this.tokenAddress;
  }
}
