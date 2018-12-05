import { v4 } from 'uuid';
import {
  Id,
  Transaction as TransactionT,
  TransactionStatus,
} from '~/typing/types';
import { Omit } from '~/typing/helpers';

interface Params extends Omit<TransactionT, 'id'> {
  id?: string;
}

export class Transaction implements TransactionT {
  public id: Id;
  public status: TransactionStatus;
  public label?: string;
  public name: string;

  constructor({ id, status, name }: Params) {
    this.id = id || v4();
    this.status = status;
    this.name = name;
  }
}
