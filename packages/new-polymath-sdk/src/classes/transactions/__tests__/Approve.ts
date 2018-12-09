import Web3 from 'web3';
import { HttpProvider } from 'web3/providers';
import { PolymathClient, Wallet } from '~/classes';
import { Approve } from '~/classes/transactions';
import BigNumber from 'bignumber.js';

let provider: HttpProvider;

describe('Approve', () => {
  beforeEach(() => {
    provider = new Web3.providers.HttpProvider('http://localhost:8545');
  });

  describe('.constructor', () => {
    test('sets up network params on construction', async () => {
      const polymath = new PolymathClient({ provider });
      await polymath.connect();
      const spender = new Wallet({ address: '0x987654321' }, { polymath });
      const approve = new Approve(
        { amount: new BigNumber(1234), spender },
        { polymath }
      );
    });
  });
});
