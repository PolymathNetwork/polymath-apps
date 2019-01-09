import { TransactionSpec, ProcedureTypes } from '~/types';
import { PolyTransaction } from '~/entities/PolyTransaction';

export class Sequence<T extends ProcedureTypes> {
  public static readonly entityType: string = 'sequence';
  public transactions: PolyTransaction[];
  public readonly procedureType: ProcedureTypes;
  public promise: Promise<any>;
  private queue: PolyTransaction[] = [];

  constructor(transactions: TransactionSpec<any>[], procedureType?: T) {
    this.promise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
    this.procedureType = procedureType || ProcedureTypes.Unnamed;
    this.transactions = transactions.map(transaction => {
      return new PolyTransaction(transaction);
    });
  }

  public async run() {
    this.queue = [...this.transactions];

    try {
      const res = await this.executeTransactionQueue();
      this.resolve(res);
      return res;
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

  private async finish() {
    this.resolve();
  }
}
