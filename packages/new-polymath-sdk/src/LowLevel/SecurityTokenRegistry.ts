import Web3 from 'web3';
import Eth from 'web3/eth';
import { SecurityTokenRegistryAbi } from '~/LowLevel/abis/SecurityTokenRegistryAbi';
import { Contract } from './Contract';
import { TransactionObject } from 'web3/eth/types';
import { types } from '@polymathnetwork/new-shared';

// This type should be obtained from a library (must match ABI)
interface SecurityTokenRegistryContract {
  methods: {
    registerTicker(
      owner: types.Address,
      ticker: string,
      tokenName: string
    ): TransactionObject<string>;
  };
}

export class SecurityTokenRegistry extends Contract<
  SecurityTokenRegistryContract
> {
  constructor({ address, web3 }: { address: string; web3: Web3 }) {
    super({ address, abi: SecurityTokenRegistryAbi.abi, web3 });
  }

  public async registerTicker(
    owner: types.Address,
    ticker: string,
    tokenName: string
  ) {
    return this.contract.methods
      .registerTicker(owner, ticker, tokenName)
      .call();
  }
}
