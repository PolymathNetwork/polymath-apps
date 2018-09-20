// @flow

import mongoose from 'mongoose';
import logger from 'winston';
import P from 'bluebird';

mongoose.Promise = P;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    logger.info('Database connected.');
  })
  .catch(err => {
    logger.error(err);
  });
