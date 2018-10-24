// @flow

import BigNumber from 'bignumber.js';

import SecurityTokenContract from './contracts/SecurityToken';

/**
 * CORE TYPES
 */

export type Web3 = {|
  eth: {
    clearSubscriptions: Function,
    getTransactionReceipt: Function,
    getBlock: Function,
    abi: {
      encodeFunctionCall: Function,
    },
    Contract: Function,
    sign: (dataToSign: any, address: Address) => Promise<string>,
  },
  utils: {
    toWei: Function,
    fromWei: Function,
    asciiToHex: Function,
    hexToAscii: Function,
  },
|};

export type Web3Event = {|
  returnValues: Object,
  event: string, // event name
  blockNumber: number,
  transactionHash: string,
|};

export type Web3Contract = {|
  events: Object,
  getPastEvents: (
    event: string,
    {
      filter?: Object,
      fromBlock?: number | string,
      toBlock?: number | string,
    }
  ) => Promise<Array<Web3Event>>,
  methods: Object,
|};

export type Web3Receipt = {|
  transactionHash: string,
  blockNumber: number,
  contractAddress: Address,
  gasUsed: number,
  events: { [key: string]: Web3Event },
|};

export type Address = string;

export type NetworkParams = {|
  id: number,
  web3: Web3,
  web3WS: Web3,
  account: Address,
  txHashCallback: (hash: string) => void,
  txEndCallback: (receipt: Object) => void,
|};

export type Artifact = {|
  contractName: string,
  abi: Object,
  networks: Object,
|};

/**
 * POLYMATH TYPES
 */

export type SymbolDetails = {|
  ticker: string,
  name: string,
  timestamp?: Date,
  status?: boolean,
  expires?: ?Date,
  owner?: Address,
  txHash?: string,
|};

export type SecurityToken = {|
  ticker: string,
  name: string,
  status: boolean,
  owner: Address,
  expires: ?Date,
  timestamp: Date,
  txHash: string, // ticker registration or token deployment (depends on status)

  address?: Address,
  isDivisible?: boolean,
  details?: string,
  contract?: SecurityTokenContract,
|};

export type STOFactory = {|
  title: string,
  name: string,
  desc: string,
  isVerified: boolean,
  securityAuditLink: {
    title: string,
    url: string,
  },
  address: Address,
  owner: Address,
|};

export type STODetails = {|
  address: string,
  start: Date,
  end: Date,
  cap: BigNumber,
  raised: BigNumber,
  tokensSold: BigNumber,
  rate: number,
  investorCount: number,
  isPolyFundraise: boolean,
|};

export type STOPurchase = {|
  investor: Address,
  txHash: string,
  amount: BigNumber,
  paid: BigNumber,
|};

export type Investor = {|
  address: Address,
  from?: Date,
  to?: Date,
  expiry?: Date,
  added?: Date,
  addedBy?: Address,
  canBuyFromSTO?: boolean,
  isPercentage?: boolean,
  minted?: BigNumber,
|};
