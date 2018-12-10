import { PolymathContext } from '~/types';

type PrimitiveMethod = (...args: any[]) => Promise<any>;

interface TxMethod {
  args: any[];
  method: PrimitiveMethod | TransactionBase<any>;
}

interface HigherLevelTransaction<Args = any> {
  new (args: Args, context: PolymathContext): TransactionBase<Args>;
}

function isHigherLevelTransaction(
  transaction: any
): transaction is HigherLevelTransaction {
  if (transaction.prepareTransactions) {
    return true;
  }
  return false;
}

export class TransactionBase<P> {
  protected args: P;
  protected context: PolymathContext;
  private transactions: TxMethod[] = [];

  constructor(args: P, context: PolymathContext) {
    this.args = args;
    this.context = context;
  }

  /**
   * Mandatory method that builds a list of transactions that will be
   * run.
   */
  public async prepareTransactions(): Promise<void> {}

  public async prepare(): Promise<TxMethod[]> {
    await this.prepareTransactions();
    return this.transactions;
  }

  protected addTransaction(Method: HigherLevelTransaction | PrimitiveMethod) {
    return (...args: any[]) => {
      let transaction: TxMethod;
      // If method is a HLT, instanciate it with the right context and args
      if (isHigherLevelTransaction(Method)) {
        transaction = {
          method: new Method(args, this.context),
          args,
        };
      } else {
        transaction = {
          method: Method,
          args,
        };
      }

      this.transactions.push(transaction);
    };
  }
}
