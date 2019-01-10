import { types } from '@polymathnetwork/new-shared';
import { PolyTransaction } from '~/entities/PolyTransaction';
import { PostTransactionResolver } from '~/PostTransactionResolver';

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
      public method = jest.fn(() => {
        expect(this.val.foo).toBeDefined();
      });
      private val = {
        foo: 'bar',
      };
    }

    const test = new TestContract();

    const transaction = {
      method: test.method,
      args: ['argA'],
      postTransactionResolver: new PostTransactionResolver(async () => {}),
    };

    const polyTransaction = new PolyTransaction(transaction);

    await polyTransaction.run();

    expect(transaction.method).toHaveBeenCalledWith('argA');
  });
});
