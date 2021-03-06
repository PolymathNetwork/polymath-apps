// @flow

import logger from 'winston';
import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  logger.info('[SETUP] Mailing configured');
} else {
  logger.warn('Missing env variable SENDGRID_API_KEY.');
}
