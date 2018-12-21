import { Contract } from '~/LowLevel/Contract';
import { TransactionBlueprint } from '~/classes/TransactionBlueprint';
import { TransactionGroup } from '~/classes/TransactionGroup';
import { Context } from '~/classes/Context';

export type PrimitiveMethod = (...args: any[]) => Promise<any>;

export interface TxConfig {
  args: any[];
  method: PrimitiveMethod;
  contract: Contract<any>;
  from: string;
}

export interface HigherLevelTransaction<Args = any> {
  new (args: Args, context: Context): TransactionBase<Args>;
}

function isHigherLevelTransaction(
  transaction: any
): transaction is HigherLevelTransaction {
  if (transaction.type === 'HLT') {
    return true;
  }
  return false;
}

export class TransactionBase<P> {
  public static type = 'HLT';
  protected args: P;
  protected context: Context;
  private transactions: TransactionBlueprint[] = [];
  // TODO @RafaelVidaurre: Temporary for typeguarding

  constructor(args: P, context: Context) {
    this.args = args;
    this.context = context;
  }

  /**
   * Mandatory method that builds a list of transactions that will be
   * run.
   */
  public async prepareTransactions(): Promise<void> {}

  public async prepare(): Promise<TransactionGroup> {
    await this.prepareTransactions();

    // TODO @RafaelVidaurre: add a preparation state cache to avoid repeated
    // transactions and bad validations

    return new TransactionGroup(this.transactions);
  }

  public addTransaction<T extends any[]>(
    Base: HigherLevelTransaction | Contract<any>,
    method?: (...args: T) => Promise<any>
  ) {
    return async (...args: T) => {
      // If method is a HLT, instanciate it with the right context and args
      if (isHigherLevelTransaction(Base)) {
        const hlt = new Base(args[0], this.context);
        await hlt.prepareTransactions();
        const transactions = hlt.transactions;
        this.transactions = [...this.transactions, ...transactions];
        return;
      }

      if (!method) {
        throw new Error(
          'Must supply a method if the first argument is a contract'
        );
      }

      const transaction = new TransactionBlueprint({
        contract: Base,
        method: method as PrimitiveMethod,
        args,
        from: this.context.currentWallet.address,
      });

      this.transactions.push(transaction);
    };
  }
}
