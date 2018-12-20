import _ from 'lodash';
import { TransactionSpec } from '~/types';
import { PostTransactionResolver } from '~/PostTransactionResolver';

const mapValuesDeep = (
  obj: { [key: string]: any },
  fn: (...args: any[]) => any
): { [key: string]: any } =>
  _.mapValues(obj, (val, key) =>
    _.isPlainObject(val) ? mapValuesDeep(val, fn) : fn(val, key, obj)
  );

function isPostTransactionResolver(
  val: any
): val is PostTransactionResolver<any> {
  return val instanceof Promise && (val as any).run;
}

export class Sequence {
  public queue: TransactionSpec<any>[] = [];
  public receipts: any[] = [];
  public transactions: TransactionSpec<any>[] = [];

  constructor(transactions: TransactionSpec<any>[]) {
    this.transactions = transactions;
  }

  public async run() {
    this.queue = [...this.transactions];
    await this.executeTransactionQueue();
  }

  private async unwrapArg(arg: PostTransactionResolver<any>) {
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

  private async executeTransactionQueue() {
    const nextTransaction = this.queue.pop();

    if (!nextTransaction) {
      this.finish();
      return;
    }

    const unwrappedArgs = this.unwrapArgs(nextTransaction.args);
    await nextTransaction.method(...unwrappedArgs);
    await nextTransaction.postTransactionResolver.run();

    await this.executeTransactionQueue();
  }

  private async finish() {}
}
