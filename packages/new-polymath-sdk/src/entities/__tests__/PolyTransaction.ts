import { PolyTransaction } from '../../entities/PolyTransaction';
import { TransactionQueue } from '../../entities/TransactionQueue';
import { PolyTransactionTags, TransactionStatus, isPojo } from '../../types';
import { MockedContract, getMockTransactionSpec } from '../../testUtils';
import { delay } from '../../utils';

describe('PolyTransaction', () => {
  describe('.constructor', () => {
    test('initialzes properly', () => {
      const transaction = {
        method: jest.fn(),
        args: { a: 'argA' },
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
        args: { a: 'argA' },
      };

      const polyTransaction = new PolyTransaction(
        transaction,
        {} as TransactionQueue
      );

      expect(polyTransaction).toHaveProperty('tag', PolyTransactionTags.Any);
    });

    test('starts as Idle', () => {
      const transaction = {
        method: jest.fn(),
        args: { a: 'argA' },
      };
      const polyTransaction = new PolyTransaction(
        transaction,
        {} as TransactionQueue
      );
      expect(polyTransaction.status).toEqual(TransactionStatus.Idle);
    });
  });

  test('does not need binding between the method and the contract', async () => {
    const testContract = new MockedContract();

    const transaction = getMockTransactionSpec(testContract.fakeTxOne, {
      a: 'argA',
    });

    const polyTransaction = new PolyTransaction(transaction, {
      uid: 'txqid0',
    } as TransactionQueue);

    await polyTransaction.run();

    expect(transaction.method).toHaveBeenCalledWith({ a: 'argA' });
  });

  describe('#onStatusChange', () => {
    test("calls the listener with the transaction everytime the transaction's status changes", async () => {
      const testContract = new MockedContract({ autoResolve: false });
      const transaction = getMockTransactionSpec(testContract.fakeTxOne, {});
      const polyTransaction = new PolyTransaction(transaction, {
        uid: 'tqid0',
      } as TransactionQueue);
      const listenerSpy = jest.fn();

      polyTransaction.onStatusChange(listenerSpy);
      expect(listenerSpy).not.toHaveBeenCalled();

      const runPromise = polyTransaction.run();

      expect(listenerSpy).toHaveBeenLastCalledWith(polyTransaction);

      await delay(1);

      testContract.fakeTxOnePromiEvent.eventEmitter.emit(
        'transactionHash',
        '0x1234'
      );

      expect(listenerSpy).toHaveBeenLastCalledWith(polyTransaction);
      expect(polyTransaction.txHash).toEqual('0x1234');

      testContract.fakeTxOnePromiEvent.resolve();
      await runPromise;

      expect(polyTransaction.status).toEqual(TransactionStatus.Succeeded);
    });

    test('correctly handles errors', async () => {
      const testContract = new MockedContract({ autoResolve: false });
      const transaction = getMockTransactionSpec(testContract.failureTx, {});
      const polyTransaction = new PolyTransaction(transaction, {
        uid: 'tqid0',
      } as TransactionQueue);

      const listenerSpy = jest.fn();
      polyTransaction.onStatusChange(listenerSpy);

      const runPromise = polyTransaction.run();

      await expect(runPromise).rejects.toBeInstanceOf(Error);
    });
  });

  describe('#toPojo', () => {
    test('returns a plain object representing the entity', () => {
      const testContract = new MockedContract();
      const transaction = getMockTransactionSpec(testContract.fakeTxOne, {});

      const polyTransaction = new PolyTransaction(transaction, {
        uid: 'tqid0',
      } as TransactionQueue);

      expect(isPojo(polyTransaction.toPojo())).toBeTruthy();
    });
  });

  describe('#run', () => {
    test('resolves when transaction is finished', async () => {
      const testContract = new MockedContract({ autoResolve: true });
      const transaction = getMockTransactionSpec(testContract.fakeTxOne, {});
      const polyTransaction = new PolyTransaction(transaction, {
        uid: 'tqid0',
      } as TransactionQueue);

      await polyTransaction.run();

      expect(polyTransaction.status).toEqual(TransactionStatus.Succeeded);
    });
  });
});
