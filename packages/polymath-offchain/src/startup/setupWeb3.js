// @flow

import { STO_MODULE_TYPE, NETWORKS } from '../constants';
import {
  sendCappedSTOScheduledEmail,
  sendUSDTieredSTOScheduledEmail,
  sendTickerReservedEmail,
  sendTokenCreatedEmail,
} from '../utils';
import logger from 'winston';
import Web3 from 'web3';
import { User } from '../models';
import PolymathRegistryArtifact from '@polymathnetwork/shared/fixtures/contracts/PolymathRegistry.json';
import SecurityTokenRegistryArtifact from '@polymathnetwork/shared/fixtures/contracts/SecurityTokenRegistry.json';
import SecurityTokenArtifact from '@polymathnetwork/shared/fixtures/contracts/SecurityToken.json';
import CappedSTOArtifact from '@polymathnetwork/shared/fixtures/contracts/CappedSTO.json';
import USDTieredSTOArtifact from '@polymathnetwork/shared/fixtures/contracts/USDTieredSTO.json';

// TODO @monitz87: remake this when we rework polymath-js
const web3Clients = {};
const heartbeatIntervalIds = {};

/**
 * Get the address for a specified contract
 *
 * @param {string} name name of the contract
 * @param {string} networkId id of the network where the contract is deployed
 *
 * @returns the contract address
 */
const getAddress = async (name: string, networkId: string) => {
  const client = web3Clients[networkId];
  const polymathRegistry = new client.eth.Contract(
    PolymathRegistryArtifact.abi,
    NETWORKS[networkId].polymathRegistryAddress
  );

  return await polymathRegistry.methods.getAddress(name).call();
};

/**
 * Get the corresponding Security Token contract
 *
 * @param {string} address
 * @param {string} networkId id of the network to which the contract is deployed
 *
 * @returns a web3 Security Token contract
 */
const getSTContract = (address: string, networkId: string) => {
  const client = web3Clients[networkId];
  return new client.eth.Contract(SecurityTokenArtifact.abi, address);
};

/**
 * Get the corresponding Capped STO contract
 *
 * @param {string} address
 * @param {string} networkId id of the network to which the contract is deployed
 *
 * @returns a web3 Capped STO contract
 */
const getCappedSTOContract = (address: string, networkId: string) => {
  const client = web3Clients[networkId];
  return new client.eth.Contract(CappedSTOArtifact.abi, address);
};

/**
 * Get the corresponding USD Tiered STO contract
 *
 * @param {string} address
 * @param {string} networkId id of the network to which the contract is deployed
 *
 * @returns a web3 USD Tiered STO contract
 */
const getUSDTieredSTOContract = (address: string, networkId: string) => {
  const client = web3Clients[networkId];
  return new client.eth.Contract(USDTieredSTOArtifact.abi, address);
};

/**
 * Get the Security Token Registry contract
 *
 * @param {string} networkId id of the network to which the contract is deployed
 *
 * @returns a web3 Security Token Registry contract
 */
const getSTRContract = async (networkId: string) => {
  const client = web3Clients[networkId];
  const address = await getAddress('SecurityTokenRegistry', networkId);

  return new client.eth.Contract(SecurityTokenRegistryArtifact.abi, address);
};

/**
 * Initializes and configures the WebsocketProvider
 * for the web3 client, setting listeners to reconnect on error.
 *
 * @param {string} networkId id of the network for which we want the provider
 *
 * NOTE @monitz87:
 * This is a hack to fix a current implementation limitation of web3,
 * which doesn't reconnect sockets nor re-subscribes to events when the
 * socket connection is closed
 */
const newProvider = async (networkId: string) => {
  const { name, url } = NETWORKS[networkId];
  const networkName = name.toUpperCase();

  const provider = new Web3.providers.WebsocketProvider(url);
  const connection = provider.connection;

  /**
    Check if the connection is successful
   */
  const waitForHandshakeTimeout = () =>
    new Promise(resolve => {
      setTimeout(resolve, connection._client.config.closeTimeout);
    });
  await waitForHandshakeTimeout();
  if (connection.readyState === connection.CLOSED) {
    return null;
  }

  /**
   * Reconnect when socket connection errors or ends
   */
  provider.on('error', error => {
    if (error && error.message) {
      logger.error(error.message, error);
    }

    logger.info(`[SETUP] Reconnecting ${networkName} socket after error...`);
    clearInterval(heartbeatIntervalIds[networkId]);
    reconnect(networkId);
  });
  provider.on('close', () => {
    logger.info(`[SETUP] Reconnecting ${networkName} socket after close...`);
    clearInterval(heartbeatIntervalIds[networkId]);
    reconnect(networkId);
  });
  provider.on('end', () => {
    logger.info(`[SETUP] Reconnecting ${networkName} socket after end...`);
    clearInterval(heartbeatIntervalIds[networkId]);
    reconnect(networkId);
  });

  return provider;
};

/**
  Get details of a Capped STO from the blockchain

  @param {string} address
  @param {string} networkId id of the network to which the STO belongs

  @returns an object with the STO details:

    - start (start time as a unix timestamp)
    - cap (maximum amount of tokens to sell)
    - rate (how many tokens for 1 ETH/POLY)
    - isPolyFundraise (is the currency POLY or ETH)
    - fundsReceiver (wallet to which the funds will be transfered)

    USD Tiered STO:

    NOTE @monitz87: this should be updated as soon as we have design for
    the USD Tiered STO email

    - start (start date)
    - fundsReceiver (wallet to which the funds will be transfered)
 */
const getCappedSTODetails = async (address: string, networkId: string) => {
  const contract = getCappedSTOContract(address, networkId);

  try {
    const details = await contract.methods.getSTODetails().call();
    const fundsReceiver: string = await contract.methods.wallet().call();

    /**
     * STO details are returned as an object with numerical keys ranging from 0 to 7,
     * we are interested in the following
     *
     * 0: start time
     * 2: token cap for sale
     * 3: rate (tokens per wei / POLY)
     * 7: isPolyFundraise (if the fund raising is in POLY)
     *
     * Start time is a UNIX timestamp (in seconds)
     */
    const start: number = details[0];
    const cap: number = Web3.utils.fromWei(details[2]);
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
  Get details of a USD Tiered STO from the blockchain

  @param {string} address
  @param {string} networkId id of the network to which the STO belongs

  @returns an object with the STO details:

    NOTE @monitz87: this should be updated as soon as we have design for
    the USD Tiered STO email

    - start (start time as a unix timestamp)
    - fundsReceiver (wallet to which the funds will be transfered)
 */
const getUSDTieredSTODetails = async (address: string, networkId: string) => {
  const contract = getUSDTieredSTOContract(address, networkId);

  try {
    const start = await contract.methods.startTime().call();
    const fundsReceiver: string = await contract.methods.wallet().call();

    return {
      start,
      fundsReceiver,
    };
  } catch (error) {
    logger.error(error.message, error);
    return null;
  }
};

/**
 * Gets STO details and sends email to issuer with transaction information
 *
 * @param {Object} contract Security Token contract
 * @param {string} ticker Security Token ticker
 * @param {string} networkId id of the network to which this listener is set
 * @param {Object} error listener error
 * @param {Object} result event information
 */
export const moduleAddedHandler = async (
  contract: Object,
  ticker: string,
  networkId: string,
  error: Object,
  result: Object
) => {
  if (error) {
    logger.error(error.message, error);
    return;
  }

  const {
    returnValues: { _name, _module: moduleAddress, _types },
    transactionHash,
  } = result;

  if (!_types.find(type => type === STO_MODULE_TYPE)) {
    return;
  }

  const networkName = NETWORKS[networkId].name.toUpperCase();

  logger.info(`[EVENT] STO scheduled for "${ticker}" in ${networkName}`);

  /**
   * Get the token issuer
   */
  const userAddress: string = await contract.methods.owner().call();
  const user = await User.findOne({ address: userAddress });

  if (!user) {
    logger.error(`Owner not found for ${ticker} in ${networkName}`);
    return;
  }

  const moduleName: string = Web3.utils.hexToUtf8(_name);

  const supportedSTOEmails = ['CappedSTO', 'USDTieredSTO'];

  /**
   * Skip all STOs that don't have an email template yet
   */
  if (!supportedSTOEmails.find(stoName => stoName === moduleName)) {
    logger.info(
      `[WARNING] No email template exists for the ${moduleName} module, skipping.`
    );
    return;
  }

  /**
   * Get the details of the STO
   */
  switch (moduleName) {
    case 'CappedSTO': {
      const details = await getCappedSTODetails(moduleAddress, networkId);

      if (!details) {
        return;
      }

      const { start, cap, rate, fundsReceiver, isPolyFundraise } = details;

      const { email, name } = user;

      await sendCappedSTOScheduledEmail(
        email,
        name,
        transactionHash,
        ticker,
        cap,
        fundsReceiver,
        isPolyFundraise,
        rate,
        start,
        networkId
      );
      break;
    }
    case 'USDTieredSTO': {
      const details = await getUSDTieredSTODetails(moduleAddress, networkId);

      if (!details) {
        return;
      }

      const { start, fundsReceiver } = details;

      const { email, name } = user;

      await sendUSDTieredSTOScheduledEmail(
        email,
        name,
        transactionHash,
        ticker,
        fundsReceiver,
        start,
        networkId
      );
      break;
    }
  }
};

/**
 * Add a listener to a security token that triggers
 * when it has been scheduled for STO
 *
 * @param contract security token web3 contract
 * @param ticker security token ticker
 * @param {string} networkId id of the network to which this listener will be set
 */
export const addSTOListener = (
  contract: Object,
  ticker: string,
  networkId: string
) => {
  contract.events.ModuleAdded({}, (error, result) =>
    moduleAddedHandler(contract, ticker, networkId, error, result)
  );

  logger.info(
    `[SETUP] Listening for STO for ${ticker} in ${NETWORKS[
      networkId
    ].name.toUpperCase()}`
  );
};

/**
 * Gets ticker details and sends an email to the issuer with reservation information
 *
 * @param {Object} contract Security Token Registry contract
 * @param {string} networkId id of the network to which this listener is set
 * @param {Object} error listener error
 * @param {Object} result event information
 */
export const registerTickerHandler = async (
  contract: Object,
  networkId: string,
  error: Object,
  result: Object
) => {
  if (error) {
    logger.error(error.message, error);
    return;
  }

  const {
    returnValues: { _ticker: ticker, _owner: userAddress },
    transactionHash,
  } = result;

  const networkName = NETWORKS[networkId].name.toUpperCase();

  logger.info(`[EVENT] Ticker "${ticker}" registered in ${networkName}`);

  /**
   * Get expiry limit in seconds from Security Token Registry
   */
  const expiryLimitSeconds: number = await contract.methods
    .getExpiryLimit()
    .call();
  const expiryLimit = expiryLimitSeconds / 60 / 60 / 24;

  /**
   * Get the token issuer
   */
  const user = await User.findOne({ address: userAddress });

  if (!user) {
    logger.error(`Owner not found for "${ticker}" in ${networkName}`);
    return;
  }

  const { email, name } = user;

  sendTickerReservedEmail(
    email,
    name,
    transactionHash,
    ticker,
    expiryLimit,
    networkId
  );
};

/**
 * Listen for registered tickers
 *
 * @param {string} networkId id of the network to which this listener will be set
 */
export const addTickerRegisterListener = async (networkId: string) => {
  const contract = await getSTRContract(networkId);

  contract.events.RegisterTicker({}, (error, result) =>
    registerTickerHandler(contract, networkId, error, result)
  );

  logger.info(
    `[SETUP] Listening for registered tickers in ${NETWORKS[
      networkId
    ].name.toUpperCase()}`
  );
};

/**
 * New security token event handler. Sends an email to the issuer with token information.
 * Every time a new token gets deployed, also adds an STO schedule listener to it
 *
 * @param {Object} contract Security Token Registry contract
 * @param {string} networkId id of the network to which this listener is set
 * @param {Object} error listener error
 * @param {Object} result event information
 */
export const newSecurityTokenHandler = async (
  contract: Object,
  networkId: string,
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

  const networkName = NETWORKS[networkId].name.toUpperCase();

  logger.info(`[EVENT] Token "${_ticker}" deployed in ${networkName}`);

  /**
   * Get the token issuer
   */
  const user = await User.findOne({ address: userAddress });

  if (!user) {
    logger.error(`Owner not found for ${_ticker} in ${networkName}`);
    return;
  }

  const { email, name } = user;

  sendTokenCreatedEmail(email, name, transactionHash, _ticker, networkId);

  const tokenContract = getSTContract(_securityTokenAddress, networkId);

  addSTOListener(tokenContract, _ticker, networkId);
};

/**
 * Listen for newly deployed security tokens
 *
 * @param contract Security Token Registry contract
 * @param {string} networkId id of the network to which this listener will be set
 */
export const addTokenCreateListener = async (networkId: string) => {
  const contract = await getSTRContract(networkId);

  contract.events.NewSecurityToken({}, (error, result) =>
    newSecurityTokenHandler(contract, networkId, error, result)
  );

  logger.info(
    `[SETUP] Listening for Security Token deployments in ${NETWORKS[
      networkId
    ].name.toUpperCase()}`
  );
};

/**
 * Get previously deployed security tokens and add listeners for STO scheduling
 * @param {string} networkId id of the network to which we will set the listeners
 */
export const addSTOListeners = async (networkId: string) => {
  const contract = await getSTRContract(networkId);
  try {
    const previousTokenEvents = await contract.getPastEvents(
      'NewSecurityToken',
      {
        fromBlock: 0,
        toBlock: 'latest',
      }
    );

    for (let event of previousTokenEvents) {
      const {
        returnValues: { _securityTokenAddress, _ticker },
      } = event;

      const TokenContract = getSTContract(_securityTokenAddress, networkId);

      addSTOListener(TokenContract, _ticker, networkId);
    }
  } catch (error) {
    logger.error(error.message, error);
  }
};

/**
 * Asynchronously set up listeners on the blockchain to send emails
 * to issuers on the following events:
 *
 * - Ticker registered
 * - Security token created
 * - STO scheduled
 *
 * @param {string} networkId id of the network to which we will set the listeners
 */
const setupListeners = async (networkId: string) => {
  await addTickerRegisterListener(networkId);

  await addTokenCreateListener(networkId);

  await addSTOListeners(networkId);
};

/**
 * Ping the socket. If there is something wrong with the conection,
 * we kill the heartbeat and reset the web3 client and all the listeners
 *
 * @param {Object} client web3 client we want to keep alive
 * @param {string} networkId id of the network the client is connected to
 */
export const keepAlive = async (client: Object, networkId: string) => {
  const connection = client.currentProvider.connection;

  const networkName = NETWORKS[networkId].name.toUpperCase();

  const intervalId = heartbeatIntervalIds[networkId];

  try {
    const isListening = await client.eth.net.isListening();
    if (!isListening) {
      // close the socket connection to trigger a reconnect
      logger.info(
        `[SETUP] ${networkName} socket is not listening to peers, closing connection...`
      );
      clearInterval(intervalId);
      connection.close();
      return;
    }
  } catch (error) {
    logger.error(error.message, error);
    clearInterval(intervalId);
    if (
      [connection.CLOSING, connection.CLOSED].find(
        element => element === connection.readyState
      )
    ) {
      logger.info(`[SETUP] Reconnecting ${networkName} socket after close...`);
      await reconnect(networkId);
    }
  }
};

/**
 * Ping socket every 5 seconds to keep it alive
 *
 * @param {string} networkId id of the network for which we want to simulate heartbeat
 */
const simulateHeartbeat = (networkId: string) => {
  const client = web3Clients[networkId];
  heartbeatIntervalIds[networkId] = setInterval(
    () => keepAlive(client, networkId),
    5000
  );
};

/**
  Sets up heartbeat and listeners

  @param {string} networkId id of the network to which we want to connect a client
  @param {Object} provider Web3 WebsocketProvider instance
 */
const followUpConnection = async (networkId: string, provider) => {
  web3Clients[networkId] = new Web3(provider);

  simulateHeartbeat(networkId);

  try {
    await setupListeners(networkId);
  } catch (error) {
    logger.error(error.message, error);
  }
};

/**
  Reconnects the corresponding web3 client after a connection closes. Retries indefinitely
  if the provider cannnot connect

  TODO @monitz87: add a retry limit to this function that takes into consideration
  if the network is optional to decide whether to just stop reconnecting or exit the app

  @param {string} networkId id of the network to which we want to connect a client
 */
export const reconnect = async (networkId: string) => {
  let provider;

  for (;;) {
    provider = await newProvider(networkId);
    if (provider) {
      break;
    }

    logger.info(
      `[SETUP] Network ${NETWORKS[
        networkId
      ].name.toUpperCase()} not found. Retrying connection...`
    );
  }

  await followUpConnection(networkId, provider);

  return true;
};

/**
  Connects a web3 client to a new provider in the chosen network and starts all the event listeners

  @param {string} networkId id of the network to which we want to connect a client

  @returns {boolean} false if the network is unavailable, true if the connection was succesful
 */
const connectWeb3 = async (networkId: string) => {
  const provider = await newProvider(networkId);

  if (provider === null) {
    return false;
  }

  await followUpConnection(networkId, provider);

  return true;
};

export default connectWeb3;
