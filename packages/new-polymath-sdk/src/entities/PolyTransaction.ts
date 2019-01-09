import _ from 'lodash';
import { PostTransactionResolver } from '~/PostTransactionResolver';
import { TransactionSpec } from '~/types';

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

export class PolyTransaction<Type> extends Promise<Type> {
  private resolve: (val?: any) => void;
  private reject: (reason?: any) => void;
  private transaction: TransactionSpec<any>;

  constructor(transaction: TransactionSpec<any>) {
    let resolve: () => void = () => {};
    let reject: () => void = () => {};

    super((res, rej) => {
      resolve = res;
      reject = rej;
    });

    this.resolve = resolve;
    this.reject = reject;
    this.transaction = transaction;
  }

  public async run() {
    const unwrappedArgs = this.unwrapArgs(this.transaction.args);

    try {
      await this.transaction.method.bind(this.transaction.contract)(
        ...unwrappedArgs
      );
    } catch (err) {
      if (err.message.indexOf('User denied transaction signature') > -1) {
        // Here we mark as rejected
        if (this.reject) {
          this.reject('Transaction was rejected by the user');
        }
      }
    }

    await this.transaction.postTransactionResolver.run();
    this.resolve();
  }

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
