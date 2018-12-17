import { TransactionBlueprint } from './TransactionBlueprint';
import { TransactionReceipt } from 'web3/types';
import PromiEvent from 'web3/promiEvent';

export class TransactionGroup {
  public queue: TransactionBlueprint[] = [];
  public receipts: TransactionReceipt[] = [];
  public transactions: TransactionBlueprint[] = [];

  constructor(transactions: TransactionBlueprint[]) {
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
