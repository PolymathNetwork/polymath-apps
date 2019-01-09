import { TransactionSpec } from '~/types';
import { Sequence } from '~/Sequence';
import { Context } from '~/Context';
import { PostTransactionResolver } from '~/PostTransactionResolver';

function isProcedure<T extends any[]>(
  value: any
): value is ProcedureType<T[0]> {
  if (value.type === 'Procedure') {
    return true;
  }
  return false;
}

export interface ProcedureType<Args = any> {
  new (args: Args, context: Context): Procedure<Args>;
}

type LowLevelMethod<A extends any[]> = (...args: A) => Promise<any>;
type MethodOrProcedure<A extends any[]> =
  | LowLevelMethod<A>
  | ProcedureType<A[0]>;

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
    // NOTE @RafaelVidaurre: We could add a preparation state cache to avoid repeated
    // transactions and bad validations
    return new Sequence(this.transactions);
  }

  // TODO @RafaelVidaurre: Support Post-Transaction resolvers for Procedures
  // TODO @RafaelVidaurre: Correct Post-Transaction resolver return typing
  // TODO @RafaelVidaurre: Improve typing for returned function args so that
  // they can be wrapped in PostTransactionResolvers
  public addTransaction<A extends any[], R extends any>(
    ThingToRun: MethodOrProcedure<A>,
    resolver?: () => Promise<R>
  ) {
    return async (...args: A) => {
      let postTransactionResolver: PostTransactionResolver<R>;

      if (resolver) {
        postTransactionResolver = new PostTransactionResolver(resolver);
      } else {
        // Force resolver return type
        postTransactionResolver = new PostTransactionResolver(
          async () => (undefined as any) as R
        );
      }
      // If method is a Procedure, get its Transactions and push those
      if (isProcedure<A>(ThingToRun)) {
        const operation = new ThingToRun(args[0], this.context);
        await operation.prepareTransactions();
        const transactions = operation.transactions;
        this.transactions = [...this.transactions, ...transactions];
        return postTransactionResolver;
      }

      const transaction = {
        method: ThingToRun,
        args,
        postTransactionResolver,
      };

      this.transactions.push(transaction);

      return postTransactionResolver;
    };
  }
}
