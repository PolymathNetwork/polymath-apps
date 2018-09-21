// @flow

import mongoose from 'mongoose';
import logger from 'winston';
import P from 'bluebird';
import { MONGODB_URL } from '../constants';

mongoose.Promise = P;

mongoose.connection.once('open', () => logger.info('Database connected.'));
mongoose.connection.on('error', err => logger.error(err));

mongoose.connect(
  MONGODB_URL,
  { useNewUrlParser: true }
);
