import { PolymathContext } from '~/types';

interface TransactionMethod {
  args: any[];
  method: (...args: any[]) => Promise<any>;
}

export interface TransactionBase<P> {
  prepareTransactions(args: P, context: PolymathContext): Promise<void>;
  prepare(): Promise<void>;
}
export class TransactionBase<P> {
  protected args: P;
  protected context: PolymathContext;
  private transactions: TransactionMethod[] = [];

  constructor(args: P, context: PolymathContext) {
    this.args = args;
    this.context = context;
  }

  /**
   * Mandatory method that builds a list of transactions that will be
   * run.
   *
   * @param args Arguments for the transaction
   * @param context Execution context
   */
  public async prepareTransactions(): Promise<void> {}

  protected addTransaction(method: (...args: any[]) => Promise<any>) {
    return (...args: any[]) => {
      this.transactions.push({
        args,
        method,
      });
    };
  }
}
