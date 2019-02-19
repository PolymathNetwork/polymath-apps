import {
  ProcedureTypes,
  TransactionQueueStatus,
  TransactionQueuePojo,
} from '~/typing/types';

export const transactionQueuePojo = (
  data?: Partial<TransactionQueuePojo>
): TransactionQueuePojo => {
  return {
    ...(data || {}),
    transactions: [],
    status: TransactionQueueStatus.Idle,
    procedureType: ProcedureTypes.Approve,
    args: {},
    uid: 'fakeUID',
  };
};
