import PromiEvent from 'web3/promiEvent';
import { types } from '@polymathnetwork/new-shared';
import { PolyTransaction } from '~/entities/PolyTransaction';
import { PostTransactionResolver } from '~/PostTransactionResolver';
import { PolyTransactionTags } from '~/types';

describe('PolyTransaction', () => {
  describe('constructor', () => {
    test('initialzes properly', () => {
      const transaction = {
        method: jest.fn(),
        args: ['argA'],
        postTransactionResolver: new PostTransactionResolver(async () => {}),
      };
      const polyTransaction = new PolyTransaction(transaction);
      expect(polyTransaction).toBeInstanceOf(PolyTransaction);
    });

    test('has a default tag', () => {
      const transaction = {
        method: jest.fn(),
        args: ['argA'],
      };

      const polyTransaction = new PolyTransaction(transaction);

      expect(polyTransaction).toHaveProperty('tag', PolyTransactionTags.Any);
    });

    test('starts as Idle', () => {
      const transaction = {
        method: jest.fn(),
        args: ['argA'],
        postTransactionResolver: new PostTransactionResolver(async () => {}),
      };
      const polyTransaction = new PolyTransaction(transaction);
      expect(polyTransaction.status).toEqual(types.TransactionStatus.Idle);
    });
  });

  test('does not need binding between the method and the contract', async () => {
    class TestContract {
      private val = {
        foo: 'bar',
      };
      public method = () => {
        expect(this.val.foo).toBeDefined();
        return jest.fn(() => {
          return {
            once: jest.fn(),
            on: jest.fn(),
            then: jest.fn(),
            catch: jest.fn(),
          };
        });
      };
    }

    const test = new TestContract();

    const transaction = {
      method: test.method as any,
      args: ['argA'],
    };

    const polyTransaction = new PolyTransaction(transaction);

    await polyTransaction.run();

    expect(transaction.method).toHaveBeenCalledWith('argA');
  });
});
