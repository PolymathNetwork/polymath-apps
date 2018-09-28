// @flow

import logger from 'winston';

import React from 'react';
import sgMail from '@sendgrid/mail';
import ReactDOMServer from 'react-dom/server';
import {
  ProviderApplication,
  TickerReserved,
  TokenCreated,
  STOScheduled,
  AccountConfirmation,
} from '../emails';
import { SENDGRID_API_KEY } from '../constants';

import type { EmailData } from '@sendgrid/mail';

const sendEmail = async (
  email: string,
  name: string,
  subject: string,
  body: string,
  replyTo: string | EmailData = {
    email: 'tokenstudio@polymath.zendesk.com',
    name: 'Polymath Network',
  }
) => {
  const msg = {
    from: { email: 'noreply@polymath.network', name: 'Polymath Network' },
    replyTo,
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

export type Application = {|
  companyName: string,
  companyDesc: string,
  operatedIn: string,
  incorporatedIn: string,
  projectURL: ?string,
  profilesURL: ?string,
  structureURL: ?string,
  otherDetails: ?string,
|};

export const sendProviderApplicationEmail = async (
  providerEmail: string,
  providerName: string,
  companyName: string,
  issuerName: string,
  issuerEmail: string,
  application: Application
) => {
  await sendEmail(
    providerEmail,
    providerName,
    `${companyName} is interested in your services`,
    ReactDOMServer.renderToStaticMarkup(
      <ProviderApplication
        issuerName={issuerName}
        issuerEmail={issuerEmail}
        application={application}
      />
    ),
    {
      name: issuerName,
      email: issuerEmail,
    }
  );
};

export const sendTickerReservedEmail = async (
  issuerEmail: string,
  issuerName: string,
  txHash: string,
  ticker: string,
  expiryLimit: number
) => {
  await sendEmail(
    issuerEmail,
    issuerName,
    `${ticker} Symbol Reserved on Polymath`,
    ReactDOMServer.renderToStaticMarkup(
      <TickerReserved
        txHash={txHash}
        ticker={ticker}
        expiryLimit={expiryLimit}
      />
    )
  );
};

export const sendTokenCreatedEmail = async (
  issuerEmail: string,
  issuerName: string,
  txHash: string,
  ticker: string
) => {
  await sendEmail(
    issuerEmail,
    issuerName,
    `${ticker} Token Created on Polymath`,
    ReactDOMServer.renderToStaticMarkup(
      <TokenCreated txHash={txHash} ticker={ticker} />
    )
  );
};

export const sendSTOScheduledEmail = async (
  issuerEmail: string,
  issuerName: string,
  txHash: string,
  ticker: string,
  cap: number,
  fundsReceiver: string,
  isPolyFundraise: boolean,
  rate: number,
  start: Date
) => {
  await sendEmail(
    issuerEmail,
    issuerName,
    `${ticker} STO Created on Polymath`,
    ReactDOMServer.renderToStaticMarkup(
      <STOScheduled
        txHash={txHash}
        ticker={ticker}
        cap={cap}
        fundsReceiver={fundsReceiver}
        isPolyFundraise={isPolyFundraise}
        rate={rate}
        start={start}
      />
    )
  );
};

export const sendAccountConfirmationEmail = async (
  issuerEmail: string,
  issuerName: string,
  pin: string
) => {
  await sendEmail(
    issuerEmail,
    issuerName,
    'Confirm your account on Polymath',
    ReactDOMServer.renderToStaticMarkup(<AccountConfirmation pin={pin} />)
  );
};
