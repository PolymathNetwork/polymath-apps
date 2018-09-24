// @flow

import logger from 'winston';

import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '../constants';

export const sendEmail = async (
  email: string,
  name: string,
  subject: string,
  body: string,
  replyTo: string
) => {
  const msg = {
    from: { email: 'noreply@polymath.network', name: 'Polymath Network' },
    reply_to: replyTo || {
      email: 'tokenstudio@polymath.zendesk.com',
      name: 'Polymath Network',
    },
    to: { email, name },
    subject,
    html: body,
  };
  if (SENDGRID_API_KEY) {
    await sgMail.send(msg);
  } else {
    logger.warn('Not sending email since SENDGRID_API_KEY is not set.');
    logger.warn(JSON.stringify(msg));
  }
};
