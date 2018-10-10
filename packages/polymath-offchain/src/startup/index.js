// @flow
/* Setup scripts */
import './setupEnvironment';
import { NETWORKS } from '../constants';
import './initializeLogger';

import logger from 'winston';

import './setupDb';
import './setupMailing';
import connectWeb3 from './setupWeb3';

(async () => {
  const { '15': local, '42': kovan, '1': mainnet } = NETWORKS;
  if (local) {
    await connectWeb3('15');
  }

  if (kovan) {
    await connectWeb3('42');
  }

  if (mainnet) {
    await connectWeb3('1');
  }
})().catch(err => logger.error(err.message, err));
