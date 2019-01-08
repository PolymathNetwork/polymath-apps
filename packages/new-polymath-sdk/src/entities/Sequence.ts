import { TransactionSpec } from '~/types';
import { PolyTransaction } from '~/entities/PolyTransaction';

export class Sequence {
  public entityType: string = 'sequence';
  public transactions: Array<PolyTransaction<any>> = [];
  private queue: Array<PolyTransaction<any>> = [];

  constructor(transactions: Array<TransactionSpec<any>>) {
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
