import { Contract } from '~/LowLevel/Contract';
import { TransactionSpec } from '~/types';
import { Sequence } from '~/entities/Sequence';
import { Context } from '~/Context';
import { PostTransactionResolver } from '~/PostTransactionResolver';

function isProcedure(value: any): value is ProcedureType<any> {
  if (value.type === 'Procedure') {
    return true;
  }
  return false;
}

export interface ProcedureType<Args = any> {
  new (args: Args, context: Context): Procedure<Args>;
}

export class Procedure<Args> {
  public static type = 'Procedure';
  protected args: Args;
  protected context: Context;
  private transactions: TransactionSpec<any>[] = [];

  constructor(args: Args, context: Context) {
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

  public addTransaction<A extends any[]>(
    Base: ProcedureType | Contract<any>,
    method?: (...args: A) => Promise<any>,
    resolver: () => Promise<any> = async () => {}
  ) {
    return async (...args: A) => {
      // If method is a HLT, instanciate it with the right context and args
      if (isProcedure(Base)) {
        const operation = new Base(args[0], this.context);
        await operation.prepareTransactions();
        const transactions = operation.transactions;
        this.transactions = [...this.transactions, ...transactions];
        return;
      }

      if (!method) {
        throw new Error('a method must be passed');
      }

      const postTransactionResolver = new PostTransactionResolver(resolver);

      const transaction = {
        contract: Base,
        method,
        args,
        postTransactionResolver,
      };

      this.transactions.push(transaction);

      return postTransactionResolver;
    };
  }
}
