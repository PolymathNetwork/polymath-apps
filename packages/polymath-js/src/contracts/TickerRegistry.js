// @flow

import BigNumber from 'bignumber.js';
import artifact from 'polymath-core/build/contracts/TickerRegistry.json';

import Contract from './Contract';
import PolyToken from './PolyToken';
import IPFS from '../IPFS';

import type {
  Address,
  SymbolDetails,
  Web3Event,
  Web3Receipt,
} from '../types';

const LOG_REGISTER_TICKER = 'LogRegisterTicker';

type TickerIPFS = {};

class TickerRegistry extends Contract {
  expiryLimit: () => Promise<number>;

  async expiryLimitInDays(): Promise<number> {
    return Math.round((await this.expiryLimit()) / 24 / 60 / 60);
  }

  async registrationFee(): Promise<BigNumber> {
    return PolyToken.removeDecimals(
      await this._methods.registrationFee().call()
    );
  }

  async _getRegisterTickerEvents(
    _owner?: Address,
    _timestamp?: number
  ): Promise<Array<Web3Event>> {
    return await this._contractWS.getPastEvents(LOG_REGISTER_TICKER, {
      filter: {
        ...(_owner ? { _owner } : {}),
        ...(_timestamp ? { _timestamp } : {}),
      },
      fromBlock: 0,
      toBlock: 'latest',
    });
  }

  async getDetails(symbol: string, txHash?: string): Promise<?SymbolDetails> {
    let [owner, timestamp, name, swarmHash, status] = this._toArray(
      await this._methods.getDetails(symbol).call()
    );
    if (this._isEmptyAddress(owner)) {
      return null;
    }

    if (!txHash) {
      txHash = (await this._getRegisterTickerEvents(owner, timestamp))[0]
        .transactionHash;
    }

    timestamp = this._toDate(timestamp);
    let expires;
    if (!status) {
      const expiryLimit = (await this.expiryLimit()) * 1000;
      expires = new Date(timestamp.getTime() + expiryLimit);
    }
    return {
      ticker: symbol,
      owner,
      name,
      status,
      expires,
      timestamp,
      txHash,
      ...(await IPFS.get(swarmHash)),
    };
  }

  /**
   * TODO @bshevchenko: DEPRECATED since owner can be changed
   * @deprecated
   */
  async getMyTokens(): Promise<Array<SymbolDetails>> {
    const events = await this._getRegisterTickerEvents(this.account);
    const tokens = [];
    const expiryLimit = (await this.expiryLimit()) * 1000;
    for (let event of events) {
      const v = event.returnValues;
      const timestamp = this._toDate(v._timestamp);
      const expires = new Date(timestamp.getTime() + expiryLimit);
      const now = new Date();
      if (now >= expires) {
        continue;
      }
      tokens.push({
        ticker: v._symbol,
        owner: v._owner,
        name: v._name,
        expires,
        timestamp: v._timestamp,
        txHash: event.transactionHash,
      });
      const details = await this.getDetails(v._symbol, event.transactionHash);
      if (details) {
        tokens.push(details);
      }
    }
    return tokens;
  }

  async registerTicker(details: SymbolDetails): Promise<Web3Receipt> {
    const ipfs: TickerIPFS = {};
    const [fee, swarmHash] = await Promise.all([
      this.registrationFee(),
      IPFS.put(ipfs),
    ]);
    await PolyToken.approve(this.address, fee);
    return await this._tx(
      this._methods.registerTicker(
        this.account,
        details.ticker,
        details.name,
        swarmHash
      ),
      null,
      1.15
    );
  }
}

export default new TickerRegistry(artifact);
