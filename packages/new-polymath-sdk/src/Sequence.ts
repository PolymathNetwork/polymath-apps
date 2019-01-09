import { TransactionSpec } from '~/types';
import { PolyTransaction } from '~/entities/PolyTransaction';

export class Sequence {
  public static readonly entityType: string = 'sequence';
  public transactions: PolyTransaction[];
  private promise: Promise<any>;
  private queue: PolyTransaction[] = [];

  constructor(transactions: TransactionSpec<any>[]) {
    this.promise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });

    this.transactions = transactions.map(transaction => {
      return new PolyTransaction(transaction);
    });
  }

  public then(resolve: () => any, reject: () => any) {
    return this.promise.then(resolve, reject);
  }

  public async run() {
    this.queue = [...this.transactions];
    console.log('this.queue', this.queue);
    try {
      const res = await this.executeTransactionQueue();
      this.resolve(res);
    } catch (err) {
      this.reject(err);
    }
  }

  protected resolve: (val?: any) => void = () => {};
  protected reject: (reason?: any) => void = () => {};

  private async executeTransactionQueue() {
    const nextTransaction = this.queue.shift();

    if (!nextTransaction) {
      this.finish();
      return;
    }

    await nextTransaction.run();
    await this.executeTransactionQueue();
  }

  private async finish() {}
}
