// @flow

import mongoose from 'mongoose';
import logger from 'winston';
import P from 'bluebird';
import { MONGODB_URI } from '../constants';

mongoose.Promise = P;

mongoose.connection.once('open', () =>
  logger.info('[SETUP] Database connected.')
);
mongoose.connection.on('error', err => logger.error(err));

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true }
);
