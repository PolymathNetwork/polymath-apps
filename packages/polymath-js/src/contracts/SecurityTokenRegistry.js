// @flow

import BigNumber from 'bignumber.js';
import artifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/ISecurityTokenRegistry.json';
import artifact2 from '@polymathnetwork/polymath-scripts/fixtures/contracts/2.x/SecurityTokenRegistry.json';
import { ALLOW_GANACHE_ONLY } from '@polymathnetwork/shared/constants';
import { getNetworkInfo } from '@polymathnetwork/ui/components/EthNetworkWrapper/networks.js';

import Web3 from 'web3';
import semver from 'semver';
import Contract from './Contract';
import SecurityTokenContract from './SecurityToken';
import PolyToken from './PolyToken';
import PolymathRegistry from './PolymathRegistry';
import { LATEST_PROTOCOL_VERSION } from '../constants';

import type {
  SecurityToken,
  Address,
  Web3Receipt,
  Web3Event,
  SymbolDetails,
} from '../types';

const NEW_SECURITY_TOKEN_EVENT = 'NewSecurityToken';
const REGISTER_TICKER_EVENT = 'RegisterTicker';

class SecurityTokenRegistry extends Contract {
  constructor(artifact: any, address: string) {
    super(artifact, address);
    this.setAddress(address);
  }

  static cache: any;

  static async create(address: string) {
    if (SecurityTokenRegistry.cache) return SecurityTokenRegistry.cache;

    let temp: any;
    let version: string;
    let web3;

    const newProviderInjected = !!window.ethereum;
    const oldProviderInjected = !!window.web3;
    const localUrl = process.env.REACT_APP_NETWORK_LOCAL_HTTP;
    const canUseGanacheOnly =
      ALLOW_GANACHE_ONLY && process.env.NODE_ENV === 'development' && localUrl;

    // Instantiate Web3 HTTP
    if (newProviderInjected) {
      web3 = new Web3(window.ethereum);
    } else if (oldProviderInjected) {
      web3 = new Web3(window.web3.currentProvider);
    } else if (canUseGanacheOnly) {
      // If we can run the dApp without Metamask
      web3 = new Web3(localUrl);
    } else {
      // If no Metamask/Mist
      throw new Error('Metamask is not installed');
    }
    const networkId = await web3.eth.net.getId();
    const network = getNetworkInfo(networkId);
    const { polymathRegistryAddress } = network;
    PolymathRegistry.setAddress(polymathRegistryAddress);
    const securityTokenRegistryAddress = await PolymathRegistry._methods
      .getAddress('SecurityTokenRegistry')
      .call();

    try {
      temp = new SecurityTokenRegistry(artifact, securityTokenRegistryAddress);
      version = await temp._contractWS.methods
        .getLatestProtocolVersion()
        .call();
    } catch (error) {
      temp = new SecurityTokenRegistry(artifact2, securityTokenRegistryAddress);
      version = await temp._contractWS.methods.getProtocolVersion().call();
    }
    temp.version = version.join('.');
    SecurityTokenRegistry.cache = temp;
    return temp;
  }

  version: string;
  getSecurityTokenAddress: (ticker: string) => Promise<Address>;
  isSecurityToken: (address: Address) => Promise<boolean>;
  getSecurityTokenData: (
    address: Address
  ) => Promise<[string, Address, string]>;
  getExpiryLimit: () => Promise<number>;

  async expiryLimitInDays(): Promise<number> {
    return Math.round(
      (await this._contractWS.methods.getExpiryLimit().call()) / 24 / 60 / 60
    );
  }

  async registrationFee(): Promise<BigNumber> {
    const fee = await this._contractWS.methods
      .getTickerRegistrationFee()
      .call();
    return PolyToken.removeDecimals(fee);
  }

  async launchFee(): Promise<BigNumber> {
    return PolyToken.removeDecimals(
      await this._contractWS.methods.getSecurityTokenLaunchFee().call()
    );
  }

  async _getRegisterTickerEvents(
    _owner?: Address,
    _registrationDate?: number
  ): Promise<Array<Web3Event>> {
    return await this._contractWS.getPastEvents(REGISTER_TICKER_EVENT, {
      filter: {
        ...(_owner ? { _owner } : {}),
        ...(_registrationDate ? { _registrationDate } : {}),
      },
      fromBlock: 0,
      toBlock: 'latest',
    });
  }

  async getTickerDetails(
    symbol: string,
    txHash?: string
  ): Promise<?SymbolDetails> {
    let [owner, timestamp, expiryDate, name, status] = this._toArray(
      await this._contractWS.methods.getTickerDetails(symbol).call()
    );
    if (this._isEmptyAddress(owner)) {
      return null;
    }

    if (!txHash) {
      const events = await this._getRegisterTickerEvents(owner, timestamp);
      txHash = events[0].transactionHash;
    }

    timestamp = this._toDate(Number(timestamp));
    let expires;
    if (!status) {
      expires = this._toDate(Number(expiryDate));
    }

    return {
      ticker: symbol,
      owner,
      name,
      status,
      expires,
      timestamp,
      txHash,
    };
  }

  async getTokenByTicker(ticker: string): Promise<?SecurityToken> {
    const details = await this.getTickerDetails(ticker);
    if (!details) {
      return null;
    }
    let token: SecurityToken = {
      ...details,
    };
    if (details.status) {
      token.address = await this.getSecurityTokenAddress(ticker);
      const contract = await SecurityTokenContract.create(token.address);
      token.contract = contract;
      token.details = await contract.tokenDetails();
      token.isDivisible = await contract.isDivisible();
      token.owner = await contract.owner();

      // get token issuing tx hash
      const events = await this._contractWS.getPastEvents(
        NEW_SECURITY_TOKEN_EVENT,
        {
          filter: { _securityTokenAddress: token.address },
          fromBlock: 0,
          toBlock: 'latest',
        }
      );
      token.txHash = events[0].transactionHash;
      token.timestamp = await this._getBlockDate(events[0].blockNumber);
    }

    return token;
  }

  async generateSecurityToken(token: SecurityToken): Promise<Web3Receipt> {
    const fee = await this.launchFee();
    const allowance = await PolyToken.allowance(this.account, this.address);
    //Skip approve transaction if transfer is already allowed
    if (allowance < fee) {
      await PolyToken.approve(this.address, fee);
    }
    if (semver.lt(this.version, LATEST_PROTOCOL_VERSION)) {
      return await this._tx(
        this._methods.generateSecurityToken(
          token.name,
          token.ticker,
          token.details || '',
          token.isDivisible
        ),
        null,
        1.05,
        15
      );
    }
    return await this._tx(
      this._methods.generateNewSecurityToken(
        token.name,
        token.ticker,
        token.details || '',
        token.isDivisible,
        this.account,
        0 // if _protocolVersion == 0 then latest version of securityToken will be generated
      ),
      null,
      1.05,
      15
    );
  }

  /**
   * TODO @bshevchenko: DEPRECATED since owner can be changed
   * @deprecated
   */
  async getMyTokens(): Promise<Array<SymbolDetails>> {
    const events = await this._getRegisterTickerEvents(this.account);
    const tokens = [];
    for (let event of events) {
      const v = event.returnValues;
      const expires = new Date(v._expiryDate);
      const now = new Date();
      if (now >= expires) {
        continue;
      }
      tokens.push({
        ticker: v._ticker,
        owner: v._owner,
        name: v._name,
        expires,
        timestamp: v._registrationDate,
        txHash: event.transactionHash,
      });
      const details = await this.getTickerDetails(
        v._ticker,
        event.transactionHash
      );
      if (details) {
        tokens.push(details);
      }
    }
    return tokens;
  }

  async registerTicker(details: SymbolDetails): Promise<Web3Receipt> {
    const fee = await this.registrationFee();
    const allowance = await PolyToken.allowance(this.account, this.address);
    //Skip approve transaction if transfer is already allowed
    if (allowance < fee) {
      await PolyToken.approve(this.address, fee);
    }

    return await this._tx(
      this._methods.registerTicker(this.account, details.ticker, ''),
      null,
      1.15
    );
  }
}

export default SecurityTokenRegistry;
