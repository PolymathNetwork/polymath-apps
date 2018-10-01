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

/**
  Sends an email using sendgrid

  @param {string} email email address to send the email to
  @param {string} name name of the email receiver
  @param {string} subject email subject
  @param {string} body email body
  @param {string | Object} replyTo reply address or object with a reply address and a name
 */
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

/**
  Sends an email to a provider notifying that an issuer has filled out an application form

  The application form has the following data:

  - companyName: the issuer's company name
  - companyDesc: description of the issuer's company
  - operatedIn: company's jurisdiction of operation
  - incorporatedIn: company's jursidiction of incorporation
  - projectURL: corporate/project presentation URL
  - profilesURL: management and board member profiles URL
  - structureURL: corporate or project structure/organization URL
  - otherDetails: other details about the company

  @param {string} providerEmail email address of the provider
  @param {string} providerName company name of the provider
  @param {string} issuerName name of the issuer
  @param {string} issuerEmail email address of the issuer
  @param {Object} application application form fields
 */
export const sendProviderApplicationEmail = async (
  providerEmail: string,
  providerName: string,
  issuerName: string,
  issuerEmail: string,
  application: Application
) => {
  await sendEmail(
    providerEmail,
    providerName,
    `${application.companyName} is interested in your services`,
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

/**
  Sends an email to the issuer notifying him of a ticker being reserved

  @param {string} issuerEmail email address of the issuer
  @param {string} issuerName name of the issuer
  @param {string} txHash transaction hash
  @param {string} expiryLimit number of days before the ticker reservation expires
 */
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

/**
  Sends an email to the issuer notifying him that his token has been created

  @param {string} issuerEmail email address of the issuer
  @param {string} issuerName name of the issuer
  @param {string} txHash transaction hash
  @param {string} ticker name of the token
 */
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

/**
  Sends an email to the issuer notifying him that an STO for his token has been scheduled

  @param {string} issuerEmail email address of the issuer
  @param {string} issuerName name of the issuer
  @param {string} txHash transaction hash
  @param {string} ticker name of the issuer's security token
  @param {number} cap maximum number of tokens that can be sold
  @param {string} fundsReceiver wallet address that investment funds will be transferred to
  @param {boolean} isPolyFundraise true if the funds are raised in POLY, false if they are raised in ETH
  @param {number} rate conversion rate between currency of choice and the issuer's security token
  @param {Date} start start date of the STO
 */
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

/**
  Sends an email to the provided address in order to verify that it belongs to the issuer

  @param {string} issuerEmail address to send the confirmation email to
  @param {string} issuerName name of the issuer
  @param {string} pin randomly generated code to verify the email address in the dApp
 */
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
