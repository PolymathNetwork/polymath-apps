// @flow
/* Setup scripts */
import './setupEnvironment';
import './initializeLogger';

import logger from 'winston';

import './setupDb';
import './setupMailing';
import connectWeb3 from './setupWeb3';

connectWeb3(false).catch(err => logger.error(err.message, err));
