import { Contract } from '~/LowLevel/Contract';
import { TransactionSpec } from '~/types';
import { Sequence } from '~/entities/Sequence';
import { Context } from '~/Context';

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
  private transactions: TransactionSpec[] = [];
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

  public async prepare(): Promise<Sequence> {
    await this.prepareTransactions();

    // TODO @RafaelVidaurre: add a preparation state cache to avoid repeated
    // transactions and bad validations

    return new Sequence(this.transactions);
  }

  public addTransaction(
    Base: HigherLevelTransaction | Contract<any>,
    method?: PrimitiveMethod
  ) {
    return async (...args: any[]) => {
      // If method is a HLT, instanciate it with the right context and args
      if (isHigherLevelTransaction(Base)) {
        const hlt = new Base(args[0], this.context);
        await hlt.prepareTransactions();
        const transactions = hlt.transactions;
        this.transactions = [...this.transactions, ...transactions];
        return;
      }

      const transaction = {
        contract: Base,
        method: method as PrimitiveMethod,
        args,
        from: this.context.currentWallet.address,
      };

      this.transactions.push(transaction);
    };
  }
}
