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
  checkpointId: number;
  created: Date;
  maturity: Date;
  expiry: Date;
  amount: number;
  claimedAmount: number;
  totalSupply: number;
  reclaimed: boolean;
  dividendWithheld: number;
  dividendWithheldReclaimed: number;
  name: string;
  currency: string | null;
}
