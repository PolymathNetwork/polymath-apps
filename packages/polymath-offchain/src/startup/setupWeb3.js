// @flow

import { STO_MODULE_TYPE, WEB3_NETWORK_WS } from '../constants';
import {
  sendSTOScheduledEmail,
  sendTickerReservedEmail,
  sendTokenCreatedEmail,
} from '../utils';
import logger from 'winston';
import Web3 from 'web3';
import { User } from '../models';
import TickerRegistryArtifact from '@polymathnetwork/shared/fixtures/contracts/TickerRegistry.json';
import SecurityTokenRegistryArtifact from '@polymathnetwork/shared/fixtures/contracts/SecurityTokenRegistry.json';
import SecurityTokenArtifact from '@polymathnetwork/shared/fixtures/contracts/SecurityToken.json';
import CappedSTOArtifact from '@polymathnetwork/shared/fixtures/contracts/CappedSTO.json';

// TODO @monitz87: remake this when we rework polymath-js
let web3Client = new Web3();

/**
  Get the current network id

  @returns {number} network id
 */
const getNetworkId = async () => {
  return await web3Client.eth.net.getId();
};

/**
  Get the corresponding Security Token contract

  @param {string} address

  @returns a web3 Security Token contract
 */
const getSTContract = (address: string) => {
  return new web3Client.eth.Contract(SecurityTokenArtifact.abi, address);
};

/**
  Get the corresponding Capped STO contract

  @param {string} address

  @returns a web3 Capped STO contract
 */
const getCSTOContract = (address: string) => {
  return new web3Client.eth.Contract(CappedSTOArtifact.abi, address);
};

/**
  Get the Ticker Registry contract

  @returns a web3 Ticker Registry contract
 */
const getTRContract = async () => {
  const networkId = await getNetworkId();

  return new web3Client.eth.Contract(
    TickerRegistryArtifact.abi,
    TickerRegistryArtifact.networks[networkId].address
  );
};

/**
  Get the Security Token Registry contract

  @returns a web3 Ticker Registry contract
 */
const getSTRContract = async () => {
  const networkId = await getNetworkId();

  return new web3Client.eth.Contract(
    SecurityTokenRegistryArtifact.abi,
    SecurityTokenRegistryArtifact.networks[networkId].address
  );
};

/**
  Initializes and configures the WebsocketProvider
  for the web3, setting listeners to reconnect on error.

  NOTE @monitz87:
  This is a hack to fix a current implementation limitation of web3,
  which doesn't reconnect sockets nor re-subscribes to events when the
  socket connection is closed
 */
const newProvider = () => {
  const provider = new web3Client.providers.WebsocketProvider(WEB3_NETWORK_WS);

  /**
    Reconnect when socket connection errors or ends
   */
  provider.on('error', error => {
    if (error && error.message) {
      logger.error(error.message, error);
    }

    logger.info(`[SETUP] Reconnecting socket after error...`);
    connectWeb3();
  });
  provider.on('close', () => {
    logger.info(`[SETUP] Reconnecting socket after close...`);
    connectWeb3();
  });
  provider.on('end', () => {
    logger.info(`[SETUP] Reconnecting socket after end...`);
    connectWeb3();
  });

  return provider;
};

/**
  Get details of a Capped STO from the blockchain

  @param {string} address

  @returns an object with the STO details:

    start (start date),
    cap (maximum amount of tokens to sell),
    rate (how many tokens for 1 ETH/POLY),
    isPolyFundraise (is the currency POLY or ETH),
    fundsReceiver (wallet to which the funds will be transfered)
 */
const getCappedSTODetails = async (address: string) => {
  const contract = getCSTOContract(address);

  try {
    const details = await contract.methods.getSTODetails().call();
    const fundsReceiver: string = await contract.methods.wallet().call();

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
    logger.error(error.message, error);
    return null;
  }
};

/**
  Gets STO details and sends email to issuer with transaction information

  @param {Object} contract Security Token contract
  @param {string} ticker Security Token ticker
  @param {Object} error listener error
  @param {Object} result event information
 */
export const moduleAddedHandler = async (
  contract: Object,
  ticker: string,
  error: Object,
  result: Object
) => {
  if (error) {
    logger.error(error.message, error);
    return;
  }

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

  await sendSTOScheduledEmail(
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
};

/**
  Add a listener to a security token that triggers
  when it has been scheduled for STO

  @param contract security token web3 contract 
  @param ticker security token ticker
 */
export const addSTOListener = (contract: Object, ticker: string) => {
  contract.events.LogModuleAdded(
    {
      filter: {
        _type: STO_MODULE_TYPE,
      },
    },
    (error, result) => moduleAddedHandler(contract, ticker, error, result)
  );

  logger.info(`[SETUP] Listening for STO for ${ticker}`);
};

/**
  Gets ticker details and sends an email to the issuer with reservation information

  @param {Object} contract Ticker Registry contract 
  @param {Object} error listener error
  @param {Object} result event information
 */
export const registerTickerHandler = async (
  contract: Object,
  error: Object,
  result: Object
) => {
  if (error) {
    logger.error(error.message, error);
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
  const expiryLimitSeconds: number = await contract.methods
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
};

/**
  Listen for registered tickers
*/
export const addTickerRegisterListener = async () => {
  const contract = await getTRContract();

  contract.events.LogRegisterTicker({}, (error, result) =>
    registerTickerHandler(contract, error, result)
  );

  logger.info(`[SETUP] Listening for registered tickers`);
};

/**
  New security token event handler. Sends an email to the issuer with token information.
  Every time a new token gets deployed, also adds an STO schedule listener to it

  @param {Object} contract Security Token Registry contract 
  @param {Object} error listener error
  @param {Object} result event information
 */
export const newSecurityTokenHandler = async (
  contract: Object,
  error: Object,
  result: Object
) => {
  if (error) {
    logger.error(error.message, error);
    return;
  }

  const {
    returnValues: { _securityTokenAddress, _ticker, _owner: userAddress },
    transactionHash,
  } = result;

  logger.info(`[EVENT] Token "${_ticker}" deployed`);

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

  const tokenContract = getSTContract(_securityTokenAddress);

  addSTOListener(tokenContract, _ticker);
};

/**
  Listen for newly deployed security tokens

  @param contract Security Token Registry contract
*/
export const addTokenCreateListener = async () => {
  const contract = await getSTRContract();

  contract.events.LogNewSecurityToken({}, (error, result) =>
    newSecurityTokenHandler(contract, error, result)
  );

  logger.info(`[SETUP] Listening for Security Token deployments`);
};

/**
  Get previously deployed security tokens and add listeners for STO scheduling
*/
export const addSTOListeners = async () => {
  const contract = await getSTRContract();
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

      const TokenContract = getSTContract(_securityTokenAddress);

      addSTOListener(TokenContract, _ticker);
    }
  } catch (error) {
    logger.error(error.message, error);
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
  await addTickerRegisterListener();

  await addTokenCreateListener();

  await addSTOListeners();
};

let heartbeatIntervalId;

/**
  Ping the socket. If there is something wrong with the conection,
  we kill the heartbeat and reset the web3 client and all the listeners

  @param {Object} client the web3 client instance to keep alive
 */
export const keepAlive = async (client: any) => {
  const connection = client.currentProvider.connection;

  try {
    const isListening = await web3Client.eth.net.isListening();
    if (!isListening) {
      // close the socket connection to trigger a reconnect
      logger.info(
        '[SETUP] Socket is not listening to peers, closing connection...'
      );
      clearInterval(heartbeatIntervalId);
      connection.close();
      return;
    }
  } catch (error) {
    logger.error(error.message, error);
    clearInterval(heartbeatIntervalId);
    if (
      [connection.CLOSING, connection.CLOSED].find(
        element => element === connection.readyState
      )
    ) {
      logger.info(`[SETUP] Reconnecting socket after close...`);
      await connectWeb3();
    }
  }
};

/**
  Ping socket every 5 seconds to keep it alive
  */
const simulateHeartbeat = () => {
  heartbeatIntervalId = setInterval(() => keepAlive(web3Client), 5000);
};

/**
  Connects the web3 client to a new provider and starts all the event listeners
 */
const connectWeb3 = async () => {
  web3Client = new Web3(newProvider());

  simulateHeartbeat();

  try {
    await setupListeners();
  } catch (error) {
    logger.error(error.message, error);
  }
};

export default connectWeb3;
