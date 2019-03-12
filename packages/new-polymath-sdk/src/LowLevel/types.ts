import BigNumber from 'bignumber.js';

export type BlockType = 'latest' | 'pending' | 'earliest' | number;

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
  _checkpointId: string;
  _created: string;
  _maturity: string;
  _expiry: string;
  _token: string;
  _amount: string;
  _totalSupply: string;
  _dividendIndex: string;
  _name: string;
}

export enum DividendModuleTypes {
  Erc20 = 'erc20',
  Eth = 'eth',
}

export enum ModuleTypes {
  Permission = 1,
  Transfer,
  Sto,
  Dividends,
  Burn,
}

export interface DividendInvestorStatus {
  address: string;
  paymentReceived: boolean;
  excluded: boolean;
  withheldTax: BigNumber;
  amountReceived: BigNumber;
  balance: BigNumber;
}

export interface Dividend {
  index: number;
  checkpointId: number;
  dividendType: DividendModuleTypes;
  created: Date;
  maturity: Date;
  expiry: Date;
  amount: BigNumber;
  claimedAmount: BigNumber;
  totalSupply: BigNumber;
  reclaimed: boolean;
  totalWithheld: BigNumber;
  totalWithheldWithdrawn: BigNumber;
  name: string;
  currency: string | null;
  investors: DividendInvestorStatus[];
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

export interface TaxWithholding {
  address: string;
  percentage: number;
}

// Call argument types

export interface GetExclusionListArgs {
  dividendIndex: number;
}

export interface GetTaxWithholdingListArgs {
  checkpointIndex: number;
}

export interface GetDividendInvestorsArgs {
  dividendIndex: number;
}

export interface GetDividendsByCheckpointArgs {
  checkpointIndex: number;
}

export interface GetDividendArgs {
  dividendIndex: number;
}

// Transaction argument types

export interface SetWithholdingArgs {
  investors: string[];
  percentages: number[];
}

export interface ReclaimDividendArgs {
  dividendIndex: number;
}

export interface WithdrawWithholdingArgs {
  dividendIndex: number;
}

export interface PushDividendPaymentArgs {
  dividendIndex: number;
  investorAddresses: string[];
}

export interface SetDividendsWalletArgs {
  address: string;
}

export interface CreateErc20DividendArgs {
  maturityDate: Date;
  expiryDate: Date;
  tokenAddress: string;
  amount: BigNumber;
  checkpointId: number;
  name: string;
  excludedAddresses?: string[];
}

export interface CreateEtherDividendArgs {
  maturityDate: Date;
  expiryDate: Date;
  amount: BigNumber;
  checkpointId: number;
  name: string;
  excludedAddresses?: string[];
}

export interface GetModuleFactoryAddressArgs {
  moduleName: string;
  moduleType: ModuleTypes;
  tokenAddress: string;
}

export interface GetModulesByTypeAndTokenArgs {
  moduleType: ModuleTypes;
  tokenAddress: string;
}

export interface GetAddressArgs {
  contractName: string;
}

export interface AllowanceArgs {
  tokenOwner: string;
  spender: string;
}

export interface GetTokensArgs {
  amount: BigNumber;
  recipient: string;
  symbol: string | null;
}

export interface BalanceOfArgs {
  address: string;
}

export interface ApproveArgs {
  spender: string;
  amount: BigNumber;
  symbol: string | null;
}

export interface AddDividendsModuleArgs {
  type: DividendModuleTypes;
  wallet: string;
}

export interface GetModuleAddressArgs {
  name: string;
}

export interface GetCheckpointArgs {
  checkpointId: number;
}

export interface RegisterTickerArgs {
  owner: string;
  ticker: string;
  tokenName: string;
}

export interface GenerateSecurityTokenArgs {
  tokenName: string;
  ticker: string;
  tokenDetails: string;
  divisible: boolean;
}

export interface GetSecurityTokenArgs {
  ticker: string;
}
