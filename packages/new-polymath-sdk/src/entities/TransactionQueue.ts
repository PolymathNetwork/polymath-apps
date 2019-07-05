import { EventEmitter } from 'events';
import {
  TransactionSpec,
  MaybeResolver,
  ProcedureTypes,
  TransactionQueueStatus,
} from '../types';
import { Entity } from './Entity';
import { PolyTransaction } from './PolyTransaction';
import { isPostTransactionResolver } from '../PostTransactionResolver';
import { serialize } from '../utils';
import v4 from 'uuid/v4';

enum Events {
  StatusChange = 'StatusChange',
  TransactionStatusChange = 'TransactionStatusChange',
}

export class TransactionQueue<
  Args extends any = any,
  ReturnType = any
> extends Entity {
  public static generateId() {
    return serialize('transaction', {
      random: v4(),
    });
  }
  public readonly entityType: string = 'transactionQueue';
  public procedureType: ProcedureTypes;
  public uid: string;
  public transactions: PolyTransaction[];
  public promise: Promise<ReturnType | undefined>;
  public status: TransactionQueueStatus = TransactionQueueStatus.Idle;
  public args: Args;
  public error?: Error;
  private queue: PolyTransaction[] = [];
  private returnValue?: MaybeResolver<ReturnType | undefined>;
  private emitter: EventEmitter;

  constructor(
    transactions: TransactionSpec[],
    procedureType: ProcedureTypes = ProcedureTypes.UnnamedProcedure,
    args: Args = {} as Args,
    returnValue?: MaybeResolver<ReturnType | undefined>
  ) {
    super(undefined, false);

    this.emitter = new EventEmitter();
    this.procedureType = procedureType;
    this.promise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
    this.args = args;
    this.returnValue = returnValue;

    this.transactions = transactions.map(transaction => {
      const txn = new PolyTransaction<typeof transaction.args>(
        transaction,
        this
      );

      txn.onStatusChange(updatedTransaction => {
        this.emitter.emit(
          Events.TransactionStatusChange,
          updatedTransaction,
          this
        );
      });

      return txn;
    });

    this.uid = TransactionQueue.generateId();
  }

  public toPojo() {
    const { uid, transactions, status, procedureType, args } = this;

    return {
      uid,
      transactions: transactions.map(transaction => transaction.toPojo()),
      status,
      procedureType,
      args,
    };
  }

  public run = async () => {
    this.queue = [...this.transactions];
    this.updateStatus(TransactionQueueStatus.Running);

    try {
      await this.executeTransactionQueue();
      this.updateStatus(TransactionQueueStatus.Succeeded);
      const { returnValue } = this;
      let res;

      if (isPostTransactionResolver(returnValue)) {
        res = returnValue.result;
      } else {
        res = returnValue;
      }

      this.resolve(res);
    } catch (err) {
      this.error = err;
      this.updateStatus(TransactionQueueStatus.Failed);
      this.reject(err);
    }

    return this.promise;
  };

  public onStatusChange(listener: (transactionQueue: this) => void) {
    this.emitter.on(Events.StatusChange, listener);

    return () => {
      this.emitter.removeListener(Events.StatusChange, listener);
    };
  }

  public onTransactionStatusChange(
    listener: (transaction: PolyTransaction, transactionQueue: this) => void
  ) {
    this.emitter.on(Events.TransactionStatusChange, listener);

    return () => {
      this.emitter.removeListener(Events.TransactionStatusChange, listener);
    };
  }

  protected resolve: (val?: ReturnType) => void = () => {};
  protected reject: (reason?: any) => void = () => {};

  private updateStatus = (status: TransactionQueueStatus) => {
    this.status = status;

    switch (status) {
      case TransactionQueueStatus.Running: {
        this.emitter.emit(Events.StatusChange, this);
        return;
      }
      case TransactionQueueStatus.Succeeded: {
        this.emitter.emit(Events.StatusChange, this);
        return;
      }
      case TransactionQueueStatus.Failed: {
        this.emitter.emit(Events.StatusChange, this, this.error);
        return;
      }
    }
  };

  private async executeTransactionQueue() {
    const nextTransaction = this.queue.shift();

    if (!nextTransaction) {
      return;
    }

    await nextTransaction.run();

    await this.executeTransactionQueue();
  }
}
