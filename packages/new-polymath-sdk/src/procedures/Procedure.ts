import _ from 'lodash';
import {
  TransactionSpec,
  ErrorCodes,
  LowLevelMethod,
  MapMaybeResolver,
  MaybeResolver,
} from '~/types';
import { TransactionQueue } from '~/entities/TransactionQueue';
import { Context } from '~/Context';
import { PostTransactionResolver } from '~/PostTransactionResolver';
import { types } from '@polymathnetwork/new-shared';
import { TransactionReceipt } from 'web3/types';
import { PolymathError } from '~/PolymathError';

function isProcedure<T>(value: any): value is ProcedureType<T> {
  return value.prototype instanceof Procedure;
}

export interface ProcedureType<Args = any> {
  new (args: Args, context: Context): Procedure<Args>;
}

type MethodOrProcedure<A> = LowLevelMethod<A> | ProcedureType<A>;

// NOTE @RafaelVidaurre: We could add a preparation state cache to avoid repeated transactions and bad validations
export abstract class Procedure<Args, ReturnType = any> {
  public type: types.ProcedureTypes = types.ProcedureTypes.UnnamedProcedure;
  protected args: Args;
  protected context: Context;
  private transactions: TransactionSpec[] = [];

  constructor(args: Args, context: Context) {
    this.args = args;
    this.context = context;
  }

  /**
   * Mandatory method that builds a list of transactions that will be
   * run.
   */

  public prepare = async () => {
    const returnValue = await this.prepareTransactions();

    const transactionQueue = new TransactionQueue<Args, ReturnType>(
      this.transactions,
      this.type,
      this.args,
      returnValue
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
  public addTransaction<A, R extends any>(
    Enqueueable: MethodOrProcedure<A>,
    {
      tag,
      resolver = (() => {}) as () => Promise<R>,
    }: {
      tag?: types.PolyTransactionTags;
      resolver?: (receipt: TransactionReceipt) => Promise<R>;
    } = {}
  ) {
    return async (args: MapMaybeResolver<A> = {} as A) => {
      const postTransactionResolver = new PostTransactionResolver(resolver);

      // If method is a Procedure, get its Transactions and push those
      if (isProcedure<A>(Enqueueable)) {
        // TODO @RafaelVidaurre: remove type assertion when Procedures support unwrapping resolvers
        const operation = new Enqueueable(args as A, this.context);

        try {
          await operation.prepareTransactions();
        } catch (err) {
          // Only throw if this is a validation error, otherwise it will have
          // already propagated on the outside
          if (err.code === ErrorCodes.ProcedureValidationError) {
            throw err;
          } else if (!err.code) {
            throw new PolymathError({
              code: ErrorCodes.FatalError,
              message: err.message,
            });
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

  protected abstract prepareTransactions(): Promise<
    MaybeResolver<ReturnType | undefined> | undefined
  >;
}
