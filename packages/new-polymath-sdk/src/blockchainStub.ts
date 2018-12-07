import { BigNumber } from 'bignumber.js';

export const blockchainStub: {
  [address: string]: {
    allowances: {
      [spender: string]: BigNumber | undefined;
    };
    balance: BigNumber;
  };
} = {};
