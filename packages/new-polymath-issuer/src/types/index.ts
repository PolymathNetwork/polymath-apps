export interface Transaction {
  id: string;
  txHash: string;
}

export interface Wallet {
  address: string;
}

export interface Identity {
  wallet: string;
  email: string;
  confirmed?: boolean;
}

export enum SessionRoles {
  Anonymous,
  LoggedIn,
  UnconfirmedUser,
  ConfirmedUser,
}
