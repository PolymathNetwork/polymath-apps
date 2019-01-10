import _ from 'lodash';
import { PostTransactionResolver } from '~/PostTransactionResolver';
import { TransactionSpec, ErrorCodes, PolyTransactionTags } from '~/types';
import { types } from '@polymathnetwork/new-shared';
import { EventEmitter } from 'events';
import { PolymathError } from '~/PolymathError';
import { TransactionReceipt } from 'web3/types';
import { Entity } from '~/entities/Entity';

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

export class PolyTransaction extends Entity {
  public entityType = 'polyTransaction';
  public uid: string;
  public status: types.TransactionStatus = types.TransactionStatus.Idle;
  public promise: Promise<any>;
  public error?: PolymathError;
  public receipt?: TransactionReceipt;
  public tag: PolyTransactionTags;
  protected method: TransactionSpec<any>['method'];
  protected args: TransactionSpec<any>['args'];
  private postResolver: PostTransactionResolver<
    any
  > = new PostTransactionResolver(async () => {});
  private emitter: EventEmitter;

  constructor(transaction: TransactionSpec<any>) {
    super(undefined, false);

    if (transaction.postTransactionResolver) {
      this.postResolver = transaction.postTransactionResolver;
    }

    this.emitter = new EventEmitter();
    this.tag = transaction.tag || PolyTransactionTags.Any;
    this.method = transaction.method;
    this.args = transaction.args;
    this.promise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
    this.uid = this.generateId();
  }

  public toPojo() {
    const { uid, status, tag, receipt, error, args } = this;

    return {
      uid,
      status,
      tag,
      receipt,
      error,
      args,
    };
  }

  public async run() {
    try {
      const res = await this.internalRun();
      this.resolve(res);
    } catch (err) {
      this.reject(err);
      this.updateStatus(types.TransactionStatus.Rejected);
    }

    await this.promise;
  }

  public onStatusChange = (listener: (transaction: this) => void) => {
    this.emitter.on(Events.StatusChange, listener);
  };

  protected resolve: (val?: any) => void = () => {};
  protected reject: (reason?: any) => void = () => {};

  private async internalRun() {
    this.updateStatus(types.TransactionStatus.Unapproved);

    const unwrappedArgs = this.unwrapArgs(this.args);
    const promiEvent = (await this.method(...unwrappedArgs))();

    // Set the Transaction as Running once it is approved by the user
    promiEvent.on('confirmation', (_receiptNumber, receipt) => {
      this.receipt = receipt;
      this.updateStatus(types.TransactionStatus.Running);
    });

    let result;
    try {
      result = await promiEvent;
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

      throw this.error;
    }

    await this.postResolver.run();

    return result;
  }

  private updateStatus = (status: types.TransactionStatus) => {
    this.status = status;

    switch (status) {
      case types.TransactionStatus.Unapproved: {
        this.emitter.emit(Events.StatusChange, this);
        return;
      }
      case types.TransactionStatus.Running: {
        this.emitter.emit(Events.StatusChange, this);
        return;
      }
      case types.TransactionStatus.Succeeded: {
        this.emitter.emit(Events.StatusChange, this);
        return;
      }
      case types.TransactionStatus.Failed: {
        this.emitter.emit(Events.StatusChange, this, this.error);
        return;
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
