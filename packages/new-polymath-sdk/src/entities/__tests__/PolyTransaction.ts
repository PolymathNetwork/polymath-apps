import { PolyTransaction } from '~/entities/PolyTransaction';
import { Contract } from '~/LowLevel/Contract';
import { GenericContract } from '~/LowLevel/types';
import { MockedContract as MockedContractClass } from '~/__mocks__/LowLevel/Contract';
import { PostTransactionResolver } from '~/PostTransactionResolver';

const MockedContract = (Contract as any) as typeof MockedContractClass;
interface TestContract<T extends GenericContract> {
  methods: {
    transactionWithArguments(foo: string): string;
  };
}

class TestContract<T extends GenericContract> {
  public methods = {
    transactionWithArguments: (argA: string) => {
      return 'someResult';
    },
  };
  public async callTransactionWithArguments(argA: string) {
    this.methods.transactionWithArguments(argA);
  }
}

describe('PolyTransaction', () => {
  let testContract: TestContract<any>;

  beforeEach(() => {
    testContract = new TestContract();
  });

  describe('constructor', () => {
    test('initialzes properly', () => {
      const transaction = {
        method: testContract.callTransactionWithArguments,
        args: { argA: 'argA' },
        postTransactionResolver: new PostTransactionResolver(async () => {}),
      };
      const polyTransaction = new PolyTransaction(transaction);
      expect(polyTransaction).toBeInstanceOf(PolyTransaction);
    });
  });
});
