import _ from 'lodash';
import { EventEmitter } from 'events';
import { types } from '@polymathnetwork/new-shared';
import { PostTransactionResolver } from '~/PostTransactionResolver';
import { TransactionSpec, ErrorCodes, DividendModuleTypes } from '~/types';
import { PolymathError } from '~/PolymathError';
import { TransactionReceipt } from 'web3/types';
import { Entity } from '~/entities/Entity';
import { TransactionQueue } from '~/entities/TransactionQueue';
import BigNumber from 'bignumber.js';

// @TODO RafaelVidaurre: Decide where this should go
const descriptionsByTag: {
  [key: string]: string;
} = {
  [types.PolyTransactionTags.EnableDividends]:
    'Enabling the distribution of dividends in ERC20 tokens, including POLY and Stablecoins',
};

enum Events {
  StatusChange = 'StatusChange',
}

function isPostTransactionResolver(
  val: any
): val is PostTransactionResolver<any> {
  return val instanceof PostTransactionResolver;
}

// TODO @RafaelVidaurre: Cleanup code
const mapValuesDeep = (
  obj: { [key: string]: any },
  fn: (...args: any[]) => any
): { [key: string]: any } =>
  _.mapValues(obj, (val, key) =>
    _.isPlainObject(val) ? mapValuesDeep(val, fn) : fn(val, key, obj)
  );

export class PolyTransaction extends Entity {
  public entityType = 'transaction';
  public uid: string;
  public status: types.TransactionStatus = types.TransactionStatus.Idle;
  public transactionQueue: TransactionQueue;
  public promise: Promise<any>;
  public error?: PolymathError;
  public receipt?: TransactionReceipt;
  public tag: types.PolyTransactionTags;
  public txHash?: string;
  public description: string;
  protected method: TransactionSpec['method'];
  protected args: TransactionSpec['args'];
  private postResolver: PostTransactionResolver<
    any
  > = new PostTransactionResolver(async () => {});
  private emitter: EventEmitter;

  constructor(
    transaction: TransactionSpec,
    transactionQueue: TransactionQueue
  ) {
    super(undefined, false);

    if (transaction.postTransactionResolver) {
      this.postResolver = transaction.postTransactionResolver;
    }

    this.emitter = new EventEmitter();
    this.tag = transaction.tag || types.PolyTransactionTags.Any;
    this.method = transaction.method;
    this.args = transaction.args;
    this.transactionQueue = transactionQueue;
    this.description = descriptionsByTag[this.tag] || this.tag;
    this.promise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
    this.uid = this.generateId();
  }

  public toPojo() {
    const {
      uid,
      status,
      tag,
      receipt,
      error,
      description,
      txHash,
      transactionQueue,
    } = this;
    const transactionQueueUid = transactionQueue.uid;

    return {
      uid,
      transactionQueueUid,
      status,
      tag,
      description,
      txHash,
      receipt,
      error,
      args: this.argsToObject(),
    };
  }

  public async run() {
    try {
      const receipt = await this.internalRun();
      this.receipt = receipt;

      this.updateStatus(types.TransactionStatus.Succeeded);
      this.resolve(receipt);
    } catch (err) {
      if (err.code === ErrorCodes.TransactionRejectedByUser) {
        this.updateStatus(types.TransactionStatus.Rejected);
      } else {
        this.updateStatus(types.TransactionStatus.Failed);
      }
      this.reject(err);
    }

    await this.promise;
  }

  public onStatusChange = (listener: (transaction: this) => void) => {
    this.emitter.on(Events.StatusChange, listener);

    return () => {
      this.emitter.removeListener(Events.StatusChange, listener);
    };
  };

  protected resolve: (val?: any) => void = () => {};
  protected reject: (reason?: any) => void = () => {};

  private async internalRun() {
    this.updateStatus(types.TransactionStatus.Unapproved);

    const unwrappedArgs = this.unwrapArgs(this.args);
    const promiEvent = (await this.method(...unwrappedArgs))();
    // Set the Transaction as Running once it is approved by the user
    promiEvent.on('transactionHash', txHash => {
      this.txHash = txHash;
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
      case types.TransactionStatus.Rejected: {
        this.emitter.emit(Events.StatusChange, this);
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

  /**
   * Transforms the transaction arguments to an object depending
   * on the transaction type
   *
   * NOTE @monitz87: this is done so that the transaction modal has access
   * to named properties. This is a temporary solution. A proper solution would be to
   * create a class for each transaction type with its own toPojo method that exposes
   * the arguments as an object
   */
  private argsToObject() {
    const { tag, args } = this;

    switch (tag) {
      case types.PolyTransactionTags.Approve: {
        const [spender, amount] = args as [string, BigNumber];

        return {
          spender,
          amount,
        };
      }
      case types.PolyTransactionTags.CreateErc20DividendDistribution: {
        const [
          maturityDate,
          expiryDate,
          erc20Address,
          amount,
          checkpointId,
          name,
          excludedAddresses,
        ] = args as [
          Date,
          Date,
          string,
          BigNumber,
          number,
          string,
          string[] | undefined
        ];

        return {
          maturityDate,
          expiryDate,
          erc20Address,
          amount,
          checkpointId,
          name,
          excludedAddresses,
        };
      }
      case types.PolyTransactionTags.CreateEtherDividendDistribution: {
        const [
          maturityDate,
          expiryDate,
          amount,
          checkpointId,
          name,
          excludedAddresses,
        ] = args as [
          Date,
          Date,
          BigNumber,
          number,
          string,
          string[] | undefined
        ];

        return {
          maturityDate,
          expiryDate,
          amount,
          checkpointId,
          name,
          excludedAddresses,
        };
      }
      case types.PolyTransactionTags.CreateSecurityToken: {
        const [name, symbol, detailsUrl, divisible] = args as [
          string,
          string,
          string,
          boolean
        ];

        return {
          name,
          symbol,
          detailsUrl,
          divisible,
        };
      }
      case types.PolyTransactionTags.EnableDividends: {
        const [type, storageWalletAddress] = args as [
          DividendModuleTypes,
          string
        ];

        return {
          type,
          storageWalletAddress,
        };
      }
      case types.PolyTransactionTags.GetTokens: {
        const [amount, beneficiaryAddress] = args as [BigNumber, string];

        return {
          amount,
          beneficiaryAddress,
        };
      }
      case types.PolyTransactionTags.ReclaimDividendFunds:
      case types.PolyTransactionTags.WithdrawTaxWithholdings: {
        const [dividendIndex] = args as [number];

        return {
          dividendIndex,
        };
      }
      case types.PolyTransactionTags.ReserveSecurityToken: {
        const [ownerAddress, symbol, name] = args as [string, string, string];

        return {
          ownerAddress,
          symbol,
          name,
        };
      }
      case types.PolyTransactionTags.SetErc20TaxWithholding:
      case types.PolyTransactionTags.SetEtherTaxWithholding: {
        const [investorAddresses, percentages] = args as [string[], number[]];

        return {
          investorAddresses,
          percentages,
        };
      }
      case types.PolyTransactionTags.CreateCheckpoint:
      case types.PolyTransactionTags.Any:
      default: {
        return {};
      }
    }
  }
}
