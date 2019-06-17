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

export enum StoModuleTypes {
  Capped = 'capped',
  UsdTiered = 'usdTiered',
}

export enum StoModuleNames {
  Capped = 'CappedSTO',
  UsdTiered = 'USDTieredSTO',
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

export interface CappedStoInvestment {
  address: string;
  tokenAmount: BigNumber;
  investedFunds: BigNumber;
  index: number;
}

// NOTE @monitz87: this is left as a separate type in case we wish
// to include other information in the future (such as the tier price and tier index)
export interface UsdTieredStoInvestment {
  address: string;
  tokenAmount: BigNumber;
  investedFunds: BigNumber;
  index: number;
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
  owner?: string;
}

export interface AddDividendsModuleArgs {
  type: DividendModuleTypes;
  wallet: string;
}

export interface GetFirstUnarchivedModuleAddressArgs {
  name: string;
}

export interface GetUnarchivedModuleAddressesArgs {
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

export interface GenerateNewSecurityTokenArgs {
  tokenName: string;
  ticker: string;
  tokenDetails: string;
  divisible: boolean;
}

export interface GetSecurityTokenArgs {
  ticker: string;
}

export enum FundraiseTypes {
  Poly = 'poly',
  Usd = 'usd',
  Ether = 'eth',
}

export interface GetTickerDetailsArgs {
  ticker: string;
}

export interface IsTickerAvailableArgs {
  ticker: string;
}

export interface AddDelegateArgs {
  delegate: string;
  details?: string;
}

export interface ChangePermissionArgs {
  delegate: string;
  module: string;
  perm: string;
  isGranted: boolean;
}

export interface GetAllDelegatesWithPermArgs {
  module: string;
  perm: string;
}

export interface TokenControllerTransferArgs {
  from: string;
  to: string;
  value: BigNumber;
  data: string;
  log: string;
}

export interface TokenSetControllerArgs {
  controller: string;
}

export interface GetStoModuleArgs {
  address: string;
}

export enum NetworkIds {
  Local = 15,
  LocalVm = 16,
  Kovan = 42,
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
}
