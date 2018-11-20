// @flow

import logger from 'winston';

import React from 'react';
import sgMail from '@sendgrid/mail';
import ReactDOMServer from 'react-dom/server';
import {
  ProviderApplication,
  TickerReserved,
  TokenCreated,
  CappedSTOScheduled,
  USDTieredSTOScheduled,
  AccountConfirmation,
} from '../emails';
import { SENDGRID_API_KEY } from '../constants';

import type { EmailData } from '@sendgrid/mail';

/**
 * Sends an email using sendgrid
 *
 * @param {string} email email address to send the email to
 * @param {string} name name of the email receiver
 * @param {string} subject email subject
 * @param {string} body email body
 * @param {string | Object} replyTo reply address or object with a reply address and a name
 */
export const sendEmail = async (
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
 * Sends an email to a provider notifying that an issuer has filled out an application form
 *
 * The application form has the following data:
 *
 * - companyName: the issuer's company name
 * - companyDesc: description of the issuer's company
 * - operatedIn: company's jurisdiction of operation
 * - incorporatedIn: company's jursidiction of incorporation
 * - projectURL: corporate/project presentation URL
 * - profilesURL: management and board member profiles URL
 * - structureURL: corporate or project structure/organization URL
 * - otherDetails: other details about the company
 *
 * @param {string} providerEmail email address of the provider
 * @param {string} providerName company name of the provider
 * @param {string} issuerName name of the issuer
 * @param {string} issuerEmail email address of the issuer
 * @param {Object} application application form fields
 * @param {boolean} dummy true if email is for testing purposes
 */
export const sendProviderApplicationEmail = async (
  providerEmail: string,
  providerName: string,
  issuerName: string,
  issuerEmail: string,
  application: Application,
  dummy: boolean
) => {
  await sendEmail(
    providerEmail,
    providerName,
    `${dummy ? 'DEMO: ' : ''}${
      application.companyName
    } is interested in your services`,
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
 * Sends an email to the issuer notifying him of a ticker being reserved
 *
 * @param {string} issuerEmail email address of the issuer
 * @param {string} issuerName name of the issuer
 * @param {string} txHash transaction hash
 * @param {string} expiryLimit number of days before the ticker reservation expires
 * @param {string} networkId id of the network in which the ticker was reserved
 */
export const sendTickerReservedEmail = async (
  issuerEmail: string,
  issuerName: string,
  txHash: string,
  ticker: string,
  expiryLimit: number,
  networkId: string
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
        networkId={networkId}
      />
    )
  );
};

/**
 * Sends an email to the issuer notifying him that his token has been created
 *
 * @param {string} issuerEmail email address of the issuer
 * @param {string} issuerName name of the issuer
 * @param {string} txHash transaction hash
 * @param {string} ticker name of the token
 * @param {string} networkId id of the network to which the token was deployed
 */
export const sendTokenCreatedEmail = async (
  issuerEmail: string,
  issuerName: string,
  txHash: string,
  ticker: string,
  networkId: string
) => {
  await sendEmail(
    issuerEmail,
    issuerName,
    `${ticker} Token Created on Polymath`,
    ReactDOMServer.renderToStaticMarkup(
      <TokenCreated txHash={txHash} ticker={ticker} networkId={networkId} />
    )
  );
};

/**
 * Sends an email to the issuer notifying him that a Capped STO for his token has been scheduled
 *
 * @param {string} issuerEmail email address of the issuer
 * @param {string} issuerName name of the issuer
 * @param {string} txHash transaction hash
 * @param {string} ticker name of the issuer's security token
 * @param {number} cap maximum number of tokens that can be sold
 * @param {string} fundsReceiver wallet address that investment funds will be transferred to
 * @param {boolean} isPolyFundraise true if the funds are raised in POLY, false if they are raised in ETH
 * @param {number} rate conversion rate between currency of choice and the issuer's security token
 * @param {number} start start time of the STO as a unix timestamp
 * @param {string} networkId id of the network in which the STO was scheduled
 */
export const sendCappedSTOScheduledEmail = async (
  issuerEmail: string,
  issuerName: string,
  txHash: string,
  ticker: string,
  cap: number,
  fundsReceiver: string,
  isPolyFundraise: boolean,
  rate: number,
  start: number,
  networkId: string
) => {
  await sendEmail(
    issuerEmail,
    issuerName,
    `${ticker} STO Created on Polymath`,
    ReactDOMServer.renderToStaticMarkup(
      <CappedSTOScheduled
        txHash={txHash}
        ticker={ticker}
        cap={cap}
        fundsReceiver={fundsReceiver}
        isPolyFundraise={isPolyFundraise}
        rate={rate}
        start={start}
        networkId={networkId}
      />
    )
  );
};

/**
 * Sends an email to the issuer notifying him that a USD Tiered STO for his token has been scheduled
 *
 * @param {string} issuerEmail email address of the issuer
 * @param {string} issuerName name of the issuer
 * @param {string} txHash transaction hash
 * @param {string} ticker name of the issuer's security token
 * @param {string} fundsReceiver wallet address that investment funds will be transferred to
 * @param {number} start start time of the STO as a unix timestamp
 * @param {string} networkId id of the network in which the STO was scheduled
 */
export const sendUSDTieredSTOScheduledEmail = async (
  issuerEmail: string,
  issuerName: string,
  txHash: string,
  ticker: string,
  fundsReceiver: string,
  start: number,
  networkId: string
) => {
  await sendEmail(
    issuerEmail,
    issuerName,
    `${ticker} STO Created on Polymath`,
    ReactDOMServer.renderToStaticMarkup(
      <USDTieredSTOScheduled
        txHash={txHash}
        ticker={ticker}
        fundsReceiver={fundsReceiver}
        start={start}
        networkId={networkId}
      />
    )
  );
};

/**
 * Sends an email to the provided address in order to verify that it belongs to the issuer
 *
 * @param {string} issuerEmail address to send the confirmation email to
 * @param {string} issuerName name of the issuer
 * @param {string} pin randomly generated code to verify the email address in the dApp
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
