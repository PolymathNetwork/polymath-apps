export enum TransactionStatus {
  Idle = 'IDLE',
  Unapproved = 'UNAPPROVED',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Succeeded = 'SUCCEEDED',
  Failed = 'FAILED',
}
export enum TransactionGroupStatus {
  Idle = 'IDLE',
  Running = 'RUNNING',
  Failed = 'FAILED',
  Succeeded = 'SUCCEEDED',
}

export type Id = string;

export interface Wallet {
  address: string;
}
export interface Identity {
  id: Id;
  name: string;
  email: string;
}
export interface Transaction {
  id: Id;
  label?: string;
  status: TransactionStatus;
  error?: string; // Maybe an object?
}
export interface TransactionGroup {
  id: Id;
  label?: string;
  status: TransactionGroupStatus;
  transactions: Id[];
  error?: string; // Maybe an object?
}
