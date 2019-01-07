import BigNumber from 'bignumber.js';

export type BlockType = 'latest' | 'pending' | 'genesis' | number;

export interface Event<T> {
  event: string;
  address: string;
  returnValues: T;
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  raw?: { data: string; topics: string[] };
}

export interface GenericContract {
  methods: { [key: string]: any };
  getPastEvents<T>(
    eventName: string,
    options?: {
      fromBlock?: BlockType;
      toBlock?: BlockType;
      filter?: { [key: string]: any };
      topics?: Array<string | null>;
    }
  ): Array<Event<T>>;
}

export interface Erc20DividendDepositedEvent {
  _depositor: string;
  _checkpointId: number;
  _created: number;
  _maturity: number;
  _expiry: number;
  _token: string;
  _amount: number;
  _totalSupply: number;
  _dividendIndex: number;
  _name: string;
}

export enum DividendModuleTypes {
  Erc20,
  Eth,
}

export interface Dividend {
  index: number;
  checkpointId: number;
  created: Date;
  maturity: Date;
  expiry: Date;
  amount: BigNumber;
  claimedAmount: BigNumber;
  totalSupply: BigNumber;
  reclaimed: boolean;
  dividendWithheld: BigNumber;
  dividendWithheldReclaimed: BigNumber;
  name: string;
  currency: string | null;
}

export interface InvestorBalance {
  address: string;
  balance: BigNumber;
}

export interface Checkpoint {
  index: number;
  investorBalances: InvestorBalance[];
  totalSupply: BigNumber;
  createdAt: Date;
}
