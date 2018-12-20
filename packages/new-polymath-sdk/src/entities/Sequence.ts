import { TransactionSpec } from '~/types';
import PromiEvent from 'web3/promiEvent';

export class Sequence {
  public queue: TransactionSpec[] = [];
  public receipts: any[] = [];
  public transactions: TransactionSpec[] = [];

  constructor(transactions: TransactionSpec[]) {
    this.transactions = transactions;
  }

  public async run() {
    this.queue = [...this.transactions];
    await this.executeTransactionQueue();
  }

  private async executeTransactionQueue() {
    const nextTransaction = this.queue.pop();

    if (!nextTransaction) {
      this.finish();
      return;
    }

    const promievent = nextTransaction.run() as PromiEvent<any>;

    await promievent;

    await this.executeTransactionQueue();
  }

  private async finish() {}
}
