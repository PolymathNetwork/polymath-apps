import _ from 'lodash';
import {
  TransactionSpec,
  LowLevelMethod,
  ProcedureTypes,
  ErrorCodes,
  PolyTransactionTags,
} from '~/types';
import { TransactionQueue } from '~/entities/TransactionQueue';
import { Context } from '~/Context';
import { PostTransactionResolver } from '~/PostTransactionResolver';

function isProcedure<T extends any[]>(
  value: any
): value is ProcedureType<T[0]> {
  return value.isProcedure;
}

export interface ProcedureType<Args = any> {
  new (args: Args, context: Context): Procedure<Args>;
}

type MethodOrProcedure<A extends any[]> =
  | LowLevelMethod<A>
  | ProcedureType<A[0]>;

// NOTE @RafaelVidaurre: We could add a preparation state cache to avoid repeated transactions and bad validations
export abstract class Procedure<Args> {
  public static type: ProcedureTypes;
  public static readonly isProcedure = true;
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

    const transactionQueue = new TransactionQueue(
      this.transactions,
      procedureType
    );

    return transactionQueue;
  };

  /**
   * Appends a Procedure or method into the TransactionQueue's queue. This defines
   * what will be run by the TransactionQueue when it is started.
   *
   * @param Enqueueable A Procedure or method that will be run in the Procedure's TransactionQueue
   * @param option.tag An optional tag for SDK users to identify this transaction, this
   * can be used for doing things such as mapping descriptions to tags in the UI
   * @param options.resolver An asynchronous callback used to provide runtime data after
   * the transaction added has finished successfully
   */
  public addTransaction<A extends any[], R extends any>(
    Enqueueable: MethodOrProcedure<A>,
    {
      tag,
      resolver = (() => {}) as () => Promise<R>,
    }: {
      tag?: PolyTransactionTags;
      resolver?: () => Promise<R>;
    } = {}
  ) {
    // TODO @RafaelVidaurre: Improve typing for returned function args so that
    // they can be wrapped in PostTransactionResolvers
    return async (...args: A) => {
      const postTransactionResolver = new PostTransactionResolver(resolver);

      // If method is a Procedure, get its Transactions and push those
      if (isProcedure<A>(Enqueueable)) {
        const operation = new Enqueueable(args[0], this.context);

        try {
          await operation.prepareTransactions();
        } catch (err) {
          // Only throw if this is a validation error, otherwise it will have
          // already propagated on the outside
          if (err.code === ErrorCodes.ProcedureValidationError) {
            throw err;
          }
        }
        const transactions = operation.transactions;
        this.transactions = [...this.transactions, ...transactions];
        return postTransactionResolver;
      }

      const transaction = {
        method: Enqueueable,
        args,
        postTransactionResolver,
        tag,
      };

      this.transactions.push(transaction);

      return postTransactionResolver;
    };
  }
  protected abstract prepareTransactions(): Promise<void>;
}
