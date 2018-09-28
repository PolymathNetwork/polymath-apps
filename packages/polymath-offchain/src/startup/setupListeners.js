// @flow

import { STO_MODULE_TYPE } from '../constants';
import {
  web3Client,
  getNetworkId,
  sendSTOScheduledEmail,
  sendTickerReservedEmail,
  sendTokenCreatedEmail,
} from '../utils';
import logger from 'winston';
import { User } from '../models';
import TickerRegistryArtifact from '@polymathnetwork/shared/fixtures/contracts/TickerRegistry.json';
import SecurityTokenRegistryArtifact from '@polymathnetwork/shared/fixtures/contracts/SecurityTokenRegistry.json';
import SecurityTokenArtifact from '@polymathnetwork/shared/fixtures/contracts/SecurityToken.json';
import CappedSTOArtifact from '@polymathnetwork/shared/fixtures/contracts/CappedSTO.json';

// TODO @monitz87: remake this when we rework polymath-js
// TODO @monitz87: add logs when listeners are ready

/**
  Creates a security token web3 contract object from an address

  @param {string} address contract address
 */
const getTokenContract = address => {
  return new web3Client.eth.Contract(SecurityTokenArtifact.abi, address);
};

/**
  Get details of a Capped STO
 */
const getCappedSTODetails = async (address: string) => {
  const CappedSTOContract = new web3Client.eth.Contract(
    CappedSTOArtifact.abi,
    address
  );

  try {
    const details = await CappedSTOContract.methods.getSTODetails().call();
    const fundsReceiver: string = await CappedSTOContract.methods
      .wallet()
      .call();

    /**
      STO details are returned as an object with numerical keys ranging from 0 to 7,
      we are interested in the following

      0: start time
      2: token cap for sale
      3: rate (tokens per wei / POLY)
      7: isPolyFundraise (if the fund raising is in POLY)

      Start time is a timestamp in seconds
     */
    const start = new Date(details[0] * 1000);
    const cap: number = details[2];
    const rate: number = details[3];
    const isPolyFundraise: boolean = details[7];

    return {
      start,
      cap,
      rate,
      isPolyFundraise,
      fundsReceiver,
    };
  } catch (error) {
    logger.error(error.message);
    return null;
  }
};

/**
  Add a one-time listener to a security token that triggers
  when it has been scheduled for STO

  @param contract security token web3 contract 
  @param ticker security token ticker
 */
const addSTOListener = (contract, ticker: string) => {
  contract.once(
    'LogModuleAdded',
    {
      filter: {
        _type: STO_MODULE_TYPE,
      },
    },
    async (error, result) => {
      const {
        returnValues: { _name, _module: moduleAddress },
        transactionHash,
      } = result;

      logger.info(`[EVENT] STO scheduled for "${ticker}"`);

      const moduleName: string = web3Client.utils.hexToUtf8(_name);

      /**
        Don't send an email for non CappedSTO modules
      */
      if (moduleName !== 'CappedSTO') {
        return;
      }
      /**
        Get the details of the STO
      */
      const details = await getCappedSTODetails(moduleAddress);

      if (!details) {
        return;
      }

      const { start, cap, rate, fundsReceiver, isPolyFundraise } = details;

      /**
        Get the token issuer

        TODO @monitz87: find out if the funds receiver always has the same address as the issuer
      */
      const userAddress: string = await contract.methods.owner().call();
      const user = await User.findOne({ address: userAddress });

      if (!user) {
        logger.error(`Owner not found for ${ticker}`);
        return;
      }

      const { email, name } = user;

      sendSTOScheduledEmail(
        email,
        name,
        transactionHash,
        ticker,
        cap,
        fundsReceiver,
        isPolyFundraise,
        rate,
        start
      );
    }
  );
  logger.info(`[SETUP] Listening for STO for ${ticker}`);
};

/**
  Listen for registered tickers
*/
const addTickerRegisterListener = async () => {
  const networkId = await getNetworkId();

  const TickerRegistryContract = new web3Client.eth.Contract(
    TickerRegistryArtifact.abi,
    TickerRegistryArtifact.networks[networkId].address
  );

  TickerRegistryContract.events.LogRegisterTicker({}, async (error, result) => {
    if (error) {
      logger.error(error.message);
      return;
    }

    const {
      returnValues: { _symbol: ticker, _owner: userAddress },
      transactionHash,
    } = result;

    logger.info(`[EVENT] Ticker "${ticker}" registered`);

    /**
      Get expiry limit in seconds from Ticker Registry
     */
    const expiryLimitSeconds: number = await TickerRegistryContract.methods
      .expiryLimit()
      .call();
    const expiryLimit = expiryLimitSeconds / 60 / 60 / 24;

    /**
      Get the token issuer
     */
    const user = await User.findOne({ address: userAddress });

    if (!user) {
      logger.error(`Owner not found for "${ticker}"`);
      return;
    }

    const { email, name } = user;

    sendTickerReservedEmail(email, name, transactionHash, ticker, expiryLimit);
  });
  logger.info(`[SETUP] Listening for registered tickers`);
};

/**
  Listen for newly deployed security tokens. Every time a new token gets deployed,
  we also add an STO schedule listener to it

  @param contract Security Token Registry contract
*/
const addTokenCreateListener = async contract => {
  contract.events.LogNewSecurityToken({}, async (error, result) => {
    if (error) {
      logger.error(error.message);
      return;
    }

    const {
      returnValues: { _securityTokenAddress, _ticker, _owner: userAddress },
      transactionHash,
    } = result;

    logger.info(`[EVENT] token "${_ticker}" deployed`);

    /**
        Get the token issuer
      */
    const user = await User.findOne({ address: userAddress });

    if (!user) {
      logger.error(`Owner not found for ${_ticker}`);
      return;
    }

    const { email, name } = user;

    sendTokenCreatedEmail(email, name, transactionHash, _ticker);

    const TokenContract = getTokenContract(_securityTokenAddress);

    addSTOListener(TokenContract, _ticker);
  });
  logger.info(`[SETUP] Listening for Security Token deployments`);
};

/**
  Get previously deployed security tokens and add listeners for STO scheduling

  @param contract Security Token Registry contract
*/
const addSTOListeners = async contract => {
  try {
    const previousTokenEvents = await contract.getPastEvents(
      'LogNewSecurityToken',
      {
        fromBlock: 0,
        toBlock: 'latest',
      }
    );

    for (let event of previousTokenEvents) {
      const {
        returnValues: { _securityTokenAddress, _ticker },
      } = event;

      const TokenContract = getTokenContract(_securityTokenAddress);

      addSTOListener(TokenContract, _ticker);
    }
  } catch (error) {
    logger.error(error.message);
  }
};

/**
  Asynchronously set up listeners on the blockchain to send emails
  to issuers on the following events:

  - Ticker registered
  - Security token created
  - STO scheduled
 */
const setupListeners = async () => {
  const networkId = await getNetworkId();

  await addTickerRegisterListener();

  const SecurityTokenRegistryContract = new web3Client.eth.Contract(
    SecurityTokenRegistryArtifact.abi,
    SecurityTokenRegistryArtifact.networks[networkId].address
  );

  await addTokenCreateListener(SecurityTokenRegistryContract);

  await addSTOListeners(SecurityTokenRegistryContract);
};

export default setupListeners;
