import Web3 from 'web3';
import { ERC20DividendCheckpointAbi } from '~/LowLevel/abis/ERC20DividendCheckpointAbi';
import { Contract } from './Contract';
import { TransactionObject } from 'web3/eth/types';
import BigNumber from 'bignumber.js';

// This type should be obtained from a library (must match ABI)
interface ERC20DividendCheckpointFactoryContract {
  methods: {
    deploy(): TransactionObject<string>;
    addModule(
      address: string,
      data: string,
      maxCost: BigNumber,
      budget: BigNumber
    ): TransactionObject<void>;
  };
}

export class SecurityToken extends Contract<SecurityTokenContract> {
  constructor({ address, web3 }: { address: string; web3: Web3 }) {
    super({ address, abi: SecurityTokenAbi.abi, web3 });
  }

  public async createCheckpoint() {
    return this.contract.methods.createCheckpoint();
  }

  public async addModule(
    address: string,
    data: string,
    maxCost: BigNumber,
    budget: BigNumber
  ) {
    return this.contract.methods.addModule(address, data, maxCost, budget);
  }
}
