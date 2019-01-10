import { GenericContract } from '~/LowLevel/types';
import { PolyTransaction } from '~/entities/PolyTransaction';
import { MockedContract as MockedContractClass } from '~/__mocks__/LowLevel/Contract';
import { Sequence } from '../entities/Sequence';
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

describe('Sequence', () => {
  let testContract: TestContract<any>;

  beforeEach(() => {
    testContract = new TestContract();
  });

  describe('constructor', () => {
    test('initializes properly', () => {
      const transaction = getMockTransactionSpec(testContract.fakeTxOne, [
        'someString',
      ]);
      const sequence = new Sequence([transaction]);
      expect(sequence).toBeInstanceOf(Sequence);
      expect(sequence.run()).toBeInstanceOf(Promise);
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
      const sequence = new Sequence([txOne, txTwo]);
      await sequence.run();

      // expect something to have been called
    });
  });
});
