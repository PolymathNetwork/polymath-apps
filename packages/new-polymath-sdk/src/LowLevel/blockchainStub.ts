import { BigNumber } from 'bignumber.js';

export const blockchainStub: {
  [address: string]: {
    allowances: {
      [token: string]: { [spender: string]: BigNumber | undefined };
    };
    balances: { [token: string]: BigNumber };
  };
} = {};
