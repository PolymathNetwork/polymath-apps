// @flow
/* Setup scripts */
import './setupEnvironment';
import './initializeLogger';

import logger from 'winston';

import './setupDb';
import './setupMailing';
import setupListeners from './setupListeners';

setupListeners().catch(err => logger.error(err.message));
