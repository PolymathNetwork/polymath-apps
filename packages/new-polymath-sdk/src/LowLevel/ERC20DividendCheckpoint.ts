import { ERC20DividendCheckpointAbi } from '~/LowLevel/abis/ERC20DividendCheckpointAbi';
import { Contract } from './Contract';
import { TransactionObject } from 'web3/eth/types';

// This type should be obtained from a library (must match ABI)
interface ERC20DividendCheckpointContract {
  methods: {
    createCheckpoint(): TransactionObject<void>;
  };
}

export class SecurityToken extends Contract<ERC20DividendCheckpointContract> {
  constructor({ address }: { address: string }) {
    super({ address, abi: ERC20DividendCheckpointAbi.abi });
  }

  public createCheckpoint() {
    return this.contract.methods.createCheckpoint();
  }
}
