import { PolyTransaction } from '~/entities/PolyTransaction';
import { TransactionQueue } from '~/entities/TransactionQueue';
import { types } from '@polymathnetwork/new-shared';
import { MockedContract, getMockTransactionSpec } from '~/testUtils';

describe('PolyTransaction', () => {
  describe('.constructor', () => {
    test('initialzes properly', () => {
      const transaction = {
        method: jest.fn(),
        args: ['argA'],
      };
      const polyTransaction = new PolyTransaction(
        transaction,
        {} as TransactionQueue
      );
      expect(polyTransaction).toBeInstanceOf(PolyTransaction);
    });

    test('has a default tag', () => {
      const transaction = {
        method: jest.fn(),
        args: ['argA'],
      };

      const polyTransaction = new PolyTransaction(
        transaction,
        {} as TransactionQueue
      );

      expect(polyTransaction).toHaveProperty(
        'tag',
        types.PolyTransactionTags.Any
      );
    });

    test('starts as Idle', () => {
      const transaction = {
        method: jest.fn(),
        args: ['argA'],
      };
      const polyTransaction = new PolyTransaction(
        transaction,
        {} as TransactionQueue
      );
      expect(polyTransaction.status).toEqual(types.TransactionStatus.Idle);
    });
  });

  test('does not need binding between the method and the contract', async () => {
    const testContract = new MockedContract();

    const transaction = getMockTransactionSpec(testContract.fakeTxOne, [
      'argA',
    ]);

    const polyTransaction = new PolyTransaction(transaction, {
      uid: 'txqid0',
    } as TransactionQueue);

    await polyTransaction.run();

    expect(transaction.method).toHaveBeenCalledWith('argA');
  });

  describe('#onStatusChange', () => {
    test("calls the listener with the transaction everytime the transaction's staus changed", () => {
      const transaction = {};
    });
  });

  describe('#toPojo', () => {
    test('returns a plain object representing the entity', () => {
      const testContract = new MockedContract();
      const transaction = getMockTransactionSpec(testContract.fakeTxOne, []);

      const polyTransaction = new PolyTransaction(transaction, {
        uid: 'tqid0',
      } as TransactionQueue);

      expect(types.isPojo(polyTransaction.toPojo())).toBeTruthy();
    });
  });
});
