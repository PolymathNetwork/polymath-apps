import { EventEmitter } from 'events';
import { types } from '@polymathnetwork/new-shared';
import { TransactionSpec } from '~/types';
import { Entity } from './Entity';
import { PolyTransaction } from './PolyTransaction';

enum Events {
  StatusChange = 'StatusChange',
  TransactionStatusChange = 'TransactionStatusChange',
}

export class TransactionQueue extends Entity {
  public readonly entityType: string = 'transactionQueue';
  public procedureType: string;
  public uid: string;
  public transactions: PolyTransaction[];
  public promise: Promise<any>;
  public status: types.TransactionQueueStatus =
    types.TransactionQueueStatus.Idle;
  public error?: Error;
  private queue: PolyTransaction[] = [];
  private emitter: EventEmitter;

  constructor(
    transactions: TransactionSpec[],
    procedureType: string = 'UnnamedProcedure'
  ) {
    super(undefined, false);

    this.emitter = new EventEmitter();
    this.procedureType = procedureType;
    this.promise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });

    this.transactions = transactions.map(transaction => {
      const txn = new PolyTransaction(transaction, this);

      txn.onStatusChange(updatedTransaction => {
        this.emitter.emit(
          Events.TransactionStatusChange,
          updatedTransaction,
          this
        );
      });

      return txn;
    });

    this.uid = this.generateId();
    this.updateStatus(types.TransactionQueueStatus.Running);
  }

  public toPojo() {
    const { uid, transactions, status, procedureType } = this;

    return {
      uid,
      transactions: transactions.map(transaction => transaction.toPojo()),
      status,
      procedureType,
    };
  }

  public async run() {
    this.queue = [...this.transactions];
    this.updateStatus(types.TransactionQueueStatus.Running);

    try {
      const res = await this.executeTransactionQueue();
      this.updateStatus(types.TransactionQueueStatus.Succeeded);
      this.resolve(res);
    } catch (err) {
      this.error = err;
      this.updateStatus(types.TransactionQueueStatus.Failed);
      this.reject(err);
    }

    await this.promise;
  }

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

  protected resolve: (val?: any) => void = () => {};
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
      this.finish();
      return;
    }

    await nextTransaction.run();

    await this.executeTransactionQueue();
  }

  private finish() {
    this.status = types.TransactionQueueStatus.Succeeded;
    this.resolve();
  }
}
