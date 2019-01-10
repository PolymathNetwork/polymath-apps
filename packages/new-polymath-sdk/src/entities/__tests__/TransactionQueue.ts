import { GenericContract } from '~/LowLevel/types';
import { TransactionQueue } from '../TransactionQueue';
import { PostTransactionResolver } from '~/PostTransactionResolver';

class TestContract<T extends GenericContract> {
  public methods = {
    txTwo: (argA: string) => {},
    txOne: (argA: string) => {},
  };
  public fakeTxOne = async (argA: string) => {
    this.methods.txOne(argA);
  };
  public fakeTxTwo = async (argA: string) => {
    this.methods.txTwo(argA);
  };
}

const getMockTransactionSpec = (
  method: (...args: any[]) => Promise<any>,
  args: any,
  resolver = async () => {}
) => ({
  method,
  args,
  postTransactionResolver: new PostTransactionResolver(resolver),
});

describe('TransactionQueue', () => {
  let testContract: TestContract<any>;

  beforeEach(() => {
    testContract = new TestContract();
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
      const txTwo = getMockTransactionSpec(testContract.fakeTxOne, [
        'stringTwo',
      ]);
      const transactionQueue = new TransactionQueue([txOne, txTwo]);

      await transactionQueue.run();

      // expect something to have been called
    });
  });
});
