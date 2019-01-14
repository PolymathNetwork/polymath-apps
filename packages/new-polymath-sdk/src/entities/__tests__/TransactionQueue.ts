import { MockedContract, getMockTransactionSpec } from '~/testUtils';
import { TransactionQueue } from '../TransactionQueue';

describe('TransactionQueue', () => {
  let testContract: MockedContract<any>;

  beforeEach(() => {
    testContract = new MockedContract();
  });

  describe('constructor', () => {
    test('initializes properly', () => {
      const transaction = getMockTransactionSpec(testContract.fakeTxOne, [
        'someString',
      ]);
      const transactionQueue = new TransactionQueue([transaction]);
      expect(transactionQueue).toBeInstanceOf(TransactionQueue);
      expect(transactionQueue.run()).toBeInstanceOf(Promise);
    });
  });

  describe('execution', () => {
    test('resolves when it is finished', async () => {
      const txOne = getMockTransactionSpec(testContract.fakeTxOne, [
        'stringOne',
      ]);
      const txTwo = getMockTransactionSpec(testContract.fakeTxTwo, [
        'stringTwo',
      ]);
      const transactionQueue = new TransactionQueue([txOne, txTwo]);

      await transactionQueue.run();

      expect(testContract.fakeTxOne).toHaveBeenCalled();
      expect(testContract.fakeTxTwo).toHaveBeenCalled();
    });
  });
});
