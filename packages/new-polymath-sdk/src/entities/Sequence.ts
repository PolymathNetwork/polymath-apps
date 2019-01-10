import { TransactionSpec, ProcedureTypes, ErrorCodes } from '~/types';
import { EventEmitter } from 'events';
import { types } from '@polymathnetwork/new-shared';
import { Entity } from './Entity';
import { PolyTransaction } from './PolyTransaction';

enum Events {
  StatusChange = 'StatusChange',
  TransactionStatusChange = 'TransactionStatusChange',
}

export class Sequence<T extends ProcedureTypes> extends Entity {
  public readonly entityType: string = 'sequence';
  public readonly procedureType: ProcedureTypes;
  public uid: string;
  public transactions: PolyTransaction[];
  public promise: Promise<any>;
  public status: types.SequenceStatus = types.SequenceStatus.Idle;
  public error?: Error;
  private queue: PolyTransaction[] = [];
  private emitter: EventEmitter;

  constructor(transactions: TransactionSpec<any>[], procedureType?: T) {
    super(undefined, false);

    this.emitter = new EventEmitter();
    this.promise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });

    this.procedureType = procedureType || ProcedureTypes.Unnamed;
    this.transactions = transactions.map(transaction => {
      const txn = new PolyTransaction(transaction);

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
    this.updateStatus(types.SequenceStatus.Running);
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
    this.updateStatus(types.SequenceStatus.Running);

    try {
      const res = await this.executeTransactionQueue();
      this.updateStatus(types.SequenceStatus.Succeeded);
      this.resolve(res);
    } catch (err) {
      this.error = err;
      this.updateStatus(types.SequenceStatus.Failed);
      this.reject(err);
    }

    await this.promise;
  }

  public onStatusChange(listener: (sequence: this) => void) {
    this.emitter.on(Events.StatusChange, listener);
  }

  public onTransactionStatusChange(
    listener: (transaction: PolyTransaction, sequence: this) => void
  ) {
    this.emitter.on(Events.TransactionStatusChange, listener);
  }

  protected resolve: (val?: any) => void = () => {};
  protected reject: (reason?: any) => void = () => {};

  private updateStatus = (status: types.SequenceStatus) => {
    this.status = status;

    switch (status) {
      case types.SequenceStatus.Running: {
        this.emitter.emit(Events.StatusChange, this);
        return;
      }
      case types.SequenceStatus.Succeeded: {
        this.emitter.emit(Events.StatusChange, this);
        return;
      }
      case types.SequenceStatus.Failed: {
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
    this.status = types.SequenceStatus.Succeeded;
    this.resolve();
  }
}
