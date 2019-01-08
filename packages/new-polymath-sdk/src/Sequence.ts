import { TransactionSpec } from '~/types';
import { PolyTransaction } from '~/entities/PolyTransaction';

export class Sequence extends Promise<any> {
  public static readonly entityType: string = 'sequence';
  public transactions: PolyTransaction<any>[];
  protected resolve: (val?: any) => void;
  protected reject: (reason?: any) => void;

  constructor(transactions: TransactionSpec<any>[]) {
    let resolve: () => void = () => {};
    let reject: () => void = () => {};

    super((res, rej) => {
      resolve = res;
      reject = rej;
    });

    this.resolve = resolve;
    this.reject = reject;
    this.transactions = transactions.map(transaction => {
      return new PolyTransaction(transaction);
    });
  }

  public async run() {
    this.queue = [...this.transactions];
    await this.executeTransactionQueue();
  }

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
