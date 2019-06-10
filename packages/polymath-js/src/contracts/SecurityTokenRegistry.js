// @flow

import BigNumber from 'bignumber.js';
import artifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/ISecurityTokenRegistry.json';

import Contract from './Contract';
import SecurityTokenContract from './SecurityToken';
import PolyToken from './PolyToken';

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
      txHash = (await this._getRegisterTickerEvents(owner, timestamp))[0]
        .transactionHash;
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
      const contract = SecurityTokenContract.create(token.address);
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
    return await this._tx(
      this._methods.generateSecurityToken(
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
      this._methods.registerTicker(this.account, details.ticker, details.name),
      null,
      1.15
    );
  }
}

export default new SecurityTokenRegistry(artifact);
