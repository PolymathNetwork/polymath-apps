import _ from 'lodash';
import { PostTransactionResolver } from '~/PostTransactionResolver';
import { TransactionSpec, ErrorCodes } from '~/types';
import { types } from '@polymathnetwork/new-shared';
import { EventEmitter } from 'events';
import { PolymathError } from '~/PolymathError';

enum Events {
  StatusChange = 'StatusChange',
}

function isPostTransactionResolver(
  val: any
): val is PostTransactionResolver<any> {
  return val instanceof PostTransactionResolver;
}

// TODO @RafaelVidaurre: Fix typing
// TODO @RafaelVidaurre: Add support for arrays
// TODO @RafaelVidaurre: Cleanup code
const mapValuesDeep = (
  obj: { [key: string]: any },
  fn: (...args: any[]) => any
): { [key: string]: any } =>
  _.mapValues(obj, (val, key) =>
    _.isPlainObject(val) ? mapValuesDeep(val, fn) : fn(val, key, obj)
  );

/**
 *  TODOS:
 *  1. Set a unique type for the PolyTransaction
 *  2. Set a UID
 *  3. Update status based on web3 responses
 *  4. Reject with standard errors
 */
export class PolyTransaction {
  public status: types.TransactionStatus = types.TransactionStatus.Idle;
  public promise: Promise<any>;
  public error?: PolymathError;
  protected transaction: TransactionSpec<any>;
  private emitter = new EventEmitter();

  constructor(transaction: TransactionSpec<any>) {
    this.promise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });

    this.transaction = transaction;
  }

  public async run() {
    try {
      const res = await this.internalRun();
      this.resolve(res);
    } catch (err) {
      this.reject(err);
    }
    return this.promise;
  }

  public onStatusChange = (listener: (transaction: this) => void) => {
    this.emitter.on(Events.StatusChange, listener);
  };

  protected resolve: (val?: any) => void = () => {};
  protected reject: (reason?: any) => void = () => {};

  private async internalRun() {
    const unwrappedArgs = this.unwrapArgs(this.transaction.args);

    let res;

    try {
      res = await this.transaction.method(...unwrappedArgs);
    } catch (err) {
      // Wrap with PolymathError
      if (err.message.indexOf('MetaMask Tx Signature') > -1) {
        this.error = new PolymathError({
          code: ErrorCodes.TransactionRejectedByUser,
        });
      } else {
        this.error = new PolymathError({
          code: ErrorCodes.FatalError,
          message: err.message,
        });
      }

      this.updateStatus(types.TransactionStatus.Rejected);
      throw this.error;
    }

    await this.transaction.postTransactionResolver.run();

    this.resolve(res);
  }

  private updateStatus = (status: types.TransactionStatus) => {
    this.status = status;

    switch (status) {
      case types.TransactionStatus.Running: {
        this.emitter.emit(Events.StatusChange, this);
        return;
      }
      case types.TransactionStatus.Succeeded: {
        this.emitter.emit(Events.StatusChange, this);
      }
      case types.TransactionStatus.Failed: {
        this.emitter.emit(Events.StatusChange, this, this.error);
      }
    }
  };

  private unwrapArg(arg: PostTransactionResolver<any>) {
    if (isPostTransactionResolver(arg)) {
      return arg.result;
    }
    return arg;
  }

  /**
   * Picks all post-transaction resolvers and unwraps their values
   */
  private unwrapArgs(args: any[]) {
    return _.map(args, arg => {
      return _.isPlainObject(arg)
        ? mapValuesDeep(arg as { [key: string]: any }, (val: any) => {
            return this.unwrapArg(val);
          })
        : this.unwrapArg(arg);
    });
  }
}
