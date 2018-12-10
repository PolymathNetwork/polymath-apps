import Web3 from 'web3';
import { HttpProvider } from 'web3/providers';
import { PolymathClient, Wallet } from '~/classes';
import { Approve } from '~/classes/transactions';
import BigNumber from 'bignumber.js';
import { TransactionTypes } from '~/types';
import { types } from '@polymathnetwork/new-shared';

describe('Approve', () => {
  let provider: HttpProvider;
  let polymath: PolymathClient;
  let spender: Wallet;

  beforeEach(() => {
    provider = new Web3.providers.HttpProvider('http://localhost:8545');
    polymath = new PolymathClient({ provider });
    spender = new Wallet({ address: '0x12345' }, { polymath });
  });

  describe('#getTransactions', () => {
    test('adds tx to get money from faucet if required', async () => {
      polymath.currentWallet.balances[types.Tokens.Poly] = new BigNumber(500);
      polymath.currentWallet.allowances[`${spender}`] = new BigNumber(0);

      const approve = new Approve(
        { amount: new BigNumber(1000), spender },
        { polymath }
      );

      await approve.getTransactions();

      expect(approve.transactions[0]).toMatchObject({
        type: TransactionTypes.GetTokens,
      });
      expect(approve.transactions[1]).toMatchObject({
        type: TransactionTypes.Approve,
      });
    });

    test('adds approve tx if not enough allowance is set', async () => {
      const approve = new Approve(
        { amount: new BigNumber(1000), spender },
        { polymath }
      );

      await approve.getTransactions();

      expect(approve.transactions[0]).toMatchObject({
        type: TransactionTypes.Approve,
      });
    });

    test('does not add approve tx if enough allowance is set', async () => {
      const approve = new Approve(
        { amount: new BigNumber(1000), spender },
        { polymath }
      );

      await approve.getTransactions();

      expect(approve.transactions).toHaveLength(0);
    });
  });
});
