import { TransactionReceipt } from 'web3/types';

export function isPostTransactionResolver<T = any>(
  val: any
): val is PostTransactionResolver<T> {
  return val instanceof PostTransactionResolver;
}

export class PostTransactionResolver<Value extends any> {
  public result?: Value;
  private resolver: (
    receipt: TransactionReceipt
  ) => Promise<Value> | Promise<undefined>;

  constructor(resolver?: (receipt: TransactionReceipt) => Promise<Value>) {
    if (!resolver) {
      this.resolver = async () => undefined;
      return;
    }

    this.resolver = resolver;
  }

  public async run(receipt: TransactionReceipt) {
    const result = await this.resolver(receipt);

    this.result = result;
  }
}
