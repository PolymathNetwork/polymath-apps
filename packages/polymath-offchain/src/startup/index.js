// @flow
/* Setup scripts */
import './setupEnvironment';
import {
  NETWORKS,
  LOCAL_NETWORK_ID,
  LOCALVM_NETWORK_ID,
  KOVAN_NETWORK_ID,
  MAINNET_NETWORK_ID,
} from '../constants';
import './initializeLogger';

import logger from 'winston';

import './setupDb';
import './setupMailing';
import connectWeb3 from './setupWeb3';

import type { NetworkOptions } from '../constants';
import type { NetworkId } from '@polymathnetwork/shared/constants';

/**
  Attemps to connect to a network via web3.

  @param {NetworkId} networkId id of the network
  @param {NetworkOptions} options connection options
 */
const connectToNetwork = async (
  networkId: NetworkId,
  options: NetworkOptions
) => {
  const { name, optional, maxRetries, localNetwork } = options;

  const localMessage = `Are you sure ganache is running with id=${networkId}?`;
  const remoteMessage = `This could be a problem with the node.`;
  const message = `Couldn't connect to ${name}. ${
    localNetwork ? localMessage : remoteMessage
  }`;

  let success;

  for (let retries = 0; ; retries += 1) {
    success = await connectWeb3(networkId);
    if (success) {
      break;
    }

    if (retries >= maxRetries) {
      if (optional) {
        logger.warn(message);
        break;
      } else {
        throw new Error(message);
      }
    } else {
      logger.info(`[SETUP] Retrying ${name} connection (${retries + 1})...`);
    }
  }
};

(async () => {
  const {
    [LOCAL_NETWORK_ID]: local,
    [LOCALVM_NETWORK_ID]: localVM,
    [KOVAN_NETWORK_ID]: kovan,
    [MAINNET_NETWORK_ID]: mainnet,
  } = NETWORKS;

  if (local.connect) {
    await connectToNetwork(LOCAL_NETWORK_ID, local);
  }

  if (localVM.connect) {
    await connectToNetwork(LOCALVM_NETWORK_ID, localVM);
  }

  if (kovan.connect) {
    await connectToNetwork(KOVAN_NETWORK_ID, kovan);
  }

  if (mainnet.connect) {
    await connectToNetwork(MAINNET_NETWORK_ID, mainnet);
  }
})().catch(err => {
  logger.error(err.message, err);
  process.exit(0);
});
