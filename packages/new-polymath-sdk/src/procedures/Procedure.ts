import _ from 'lodash';
import { TransactionSpec, ProcedureTypes } from '~/types';
import { Sequence } from '~/Sequence';
import { Context } from '~/Context';
import { PostTransactionResolver } from '~/PostTransactionResolver';

function isProcedure<T extends any[]>(
  value: any
): value is ProcedureType<T[0]> {
  if (_.includes(ProcedureTypes, value.type)) {
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

// NOTE @RafaelVidaurre: We could add a preparation state cache to avoid repeated transactions and bad validations
export abstract class Procedure<Args> {
  public static type: ProcedureTypes;
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

  public prepare = async () => {
    const procedureType = (this.constructor as typeof Procedure).type;
    await this.prepareTransactions();
    const sequence = new Sequence(this.transactions, procedureType);

    return sequence;
  };

  /**
   * Appends a Procedure or method into the Sequence's queue. This defines
   * what will be run by the Sequence when it is started.
   *
   * @param ThingToRun A Procedure or method that will be run in the Procedure's Sequence
   * @param resolver An asynchronous callback used to provide runtime data after
   * the transaction added has finished successfully
   */
  public addTransaction<A extends any[], R extends any>(
    ThingToRun: MethodOrProcedure<A>,
    resolver?: () => Promise<R>
  ) {
    // TODO @RafaelVidaurre: Improve typing for returned function args so that
    // they can be wrapped in PostTransactionResolvers
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
  protected abstract prepareTransactions(): Promise<void>;
}
