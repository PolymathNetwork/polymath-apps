import { TransactionObject } from 'web3/eth/types';
import { GenericContract } from '../types';
import { Context } from '../LowLevel';
import { Contract } from '../Contract';
import { PolymathError } from '../../PolymathError';
import { ErrorCodes } from '../../types';

interface StubContract extends GenericContract {
  methods: {
    getProtocolVersion(): TransactionObject<number[]>;
    getLatestProtocolVersion(): TransactionObject<number[]>;
  };
}

export class Stub extends Contract<StubContract> {
  constructor({ address, abi, context }: { address: string; abi: any; context: Context }) {
    super({ address, abi, context });
  }

  public getProtocolVersion = () => {
    return this.contract.methods.getProtocolVersion().call();
  };

  public getLatestProtocolVersion = async () => {
    let version;
    // First attempt to tell protocol version by using v3.0.0 function getLatestProtocolVersion().
    try {
      version = await this.contract.methods.getLatestProtocolVersion().call();
    } catch (error) {
      if (error.message.includes('revert')) {
        // Revert means that we're calling a v2.0.0 contract. Fallback to getProtocolVersion().
        version = await this.contract.methods.getProtocolVersion().call();
      } else {
        throw new PolymathError({ code: ErrorCodes.FatalError });
      }
    }
    return version;
  };

  public getVersion = async () => {
    return await this.getLatestProtocolVersion();
  };
}
