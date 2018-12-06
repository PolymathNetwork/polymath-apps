import { typeHelpers, types } from '@polymathnetwork/new-shared';
import { v4 } from 'uuid';

type PartialTransaction = typeHelpers.Omit<types.Transaction, 'name'>;

export class PrimitiveTransaction implements PartialTransaction {
  public static type: string;
  public status = types.TransactionStatus.Idle;
  public id: types.Id = v4();
}
