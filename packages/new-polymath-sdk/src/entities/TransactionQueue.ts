import { EventEmitter } from 'events';
import { types } from '@polymathnetwork/new-shared';
import { TransactionSpec, MaybeResolver } from '~/types';
import { Entity } from './Entity';
import { PolyTransaction } from './PolyTransaction';
import { isPostTransactionResolver } from '~/PostTransactionResolver';
import { serialize } from '~/utils';
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
  public procedureType: types.ProcedureTypes;
  public uid: string;
  public transactions: PolyTransaction[];
  public promise: Promise<ReturnType | undefined>;
  public status: types.TransactionQueueStatus =
    types.TransactionQueueStatus.Idle;
  public args: Args;
  public error?: Error;
  private queue: PolyTransaction[] = [];
  private returnValue?: MaybeResolver<ReturnType | undefined>;
  private emitter: EventEmitter;

  constructor(
    transactions: TransactionSpec[],
    procedureType: types.ProcedureTypes = types.ProcedureTypes.UnnamedProcedure,
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
    this.updateStatus(types.TransactionQueueStatus.Running);

    try {
      await this.executeTransactionQueue();
      this.updateStatus(types.TransactionQueueStatus.Succeeded);
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
      this.updateStatus(types.TransactionQueueStatus.Failed);
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

  private updateStatus = (status: types.TransactionQueueStatus) => {
    this.status = status;

    switch (status) {
      case types.TransactionQueueStatus.Running: {
        this.emitter.emit(Events.StatusChange, this);
        return;
      }
      case types.TransactionQueueStatus.Succeeded: {
        this.emitter.emit(Events.StatusChange, this);
        return;
      }
      case types.TransactionQueueStatus.Failed: {
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
