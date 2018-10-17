// @flow

import Router from 'koa-router';

import crypto from 'crypto';
import { User, EmailPIN } from '../models';
import { verifySignature, sendAccountConfirmationEmail } from '../utils';

import type { Context } from 'koa';

const emailRouter = new Router();

type NewEmailRequestBody = {|
  email: string,
  name: string,
  code: string,
  sig: string,
  address: string,
|};

/**
 * Validates that the request parameters are typed correctly
 *
 * TODO @monitz87: add value validations as well
 */
const isNewEmailRequestValid = (body: NewEmailRequestBody | any) => {
  if (typeof body !== 'object') {
    return false;
  }

  return Object.keys(body).every(key => typeof body[key] === 'string');
};

/**
 * POST /email/new
 *
 * Email confirmation setup route handler. Receives an email address and sends a 
 * random confirmation PIN string to that address which is then requested by 
 * the dApp. Also stores (or updates) the user in the database
 *
 * If the request body is invalid, the response is
 *
 * {
 *   status: 'error',
 *   data: 'Invalid request body
 * }
 *
 * If the client didn't sign the verification code or the signature is not valid, the response will contain an error.
 *
 * If the code doesn't match the address in our database, the response is
 *
 * {
 *   status: 'error',
 *   data: 'Code is not valid'    
 * }
 *
 * If the signature is invalid, the response is
 *
 * {
 *   status: 'error',
 *   data: 'Sig is not valid'
 * }
 *
 * Otherwise, the response is
 *
 * {
 *   status: 'ok',
 *   data: 'Confirmation email has been sent'
 * }
 *
 * @param {string} email issuer email address
 * @param {string} name issuer name
 * @param {string} code polymath verification code
 * @param {string} sig signature
 * @param {string} address issuer ethereum address
 */
export const newEmailHandler = async (ctx: Context) => {
  let body = ctx.request.body;

  if (!isNewEmailRequestValid(body)) {
    ctx.body = {
      status: 'error',
      data: 'Invalid request body',
    };
    return;
  }

  body = ((body: any): NewEmailRequestBody);

  const { email, name, code, sig, address } = body;

  const error = await verifySignature(code, sig, address);
  if (error) {
    ctx.body = error;
    return;
  }

  /**
   * Assign a random PIN string to the user and send it via email
   */
  const pin = crypto.randomBytes(8).toString('hex');
  await EmailPIN.create({ address, pin, email, isConfirmed: false });
  await User.update({ address }, { name }, { upsert: true });

  await sendAccountConfirmationEmail(email, name, pin);

  ctx.body = {
    status: 'ok',
    data: 'Confirmation email has been sent',
  };
};

type ConfirmationEmailRequestBody = {|
  pin: string,
|};

/**
 * Validates that the request parameters are typed correctly
 *
 * TODO @monitz87: add value validations as well
 */
const isConfirmationEmailRequestValid = (
  body: ConfirmationEmailRequestBody | any
) => {
  const { pin } = body;

  return pin && typeof pin === 'string';
};

/**
 * POST /email/confirm
 *
 * Email confirmation route handler. Receives a PIN string from the client and validates if that PIN was created in the last 24 hours.
 *
 * If the request body is invalid, the response is
 *
 * {
 *   status: 'error',
 *   data: 'Invalid request body
 * }
 *
 * If the PIN doesn't match a user in the database, the response is
 *
 * {
 *   status: 'error',
 *   data: 'Pin is not valid',
 * }
 *
 * Otherwise, the user's email is confirmed and the response is
 *
 * {
 *   status: 'ok',
 *   data: 'Email has been confirmed',
 * }
 *
 * @param {string} pin confirmation PIN string received via email
 */
export const confirmEmailHandler = async (ctx: Context) => {
  let body = ctx.request.body;

  if (!isConfirmationEmailRequestValid(body)) {
    ctx.body = {
      status: 'error',
      data: 'Invalid request body',
    };
    return;
  }

  body = ((body: any): ConfirmationEmailRequestBody);

  const { pin } = body;

  /**
   * Find if there is a matching pin number created in the last 24 hours
   *
   * TODO @monitz87: make Email PINs expirable and use moment instead of Date
   */
  const minCreatedAt = new Date();
  minCreatedAt.setHours(minCreatedAt.getHours() - 24);

  const emailPin = await EmailPIN.findOneAndUpdate(
    {
      pin: String(pin).toLowerCase(),
      isConfirmed: false,
      createdAt: { $gte: minCreatedAt },
    },
    { isConfirmed: true }
  );
  if (!emailPin) {
    ctx.body = {
      status: 'error',
      data: 'Pin is not valid',
    };
    return;
  }

  await User.update({ address: emailPin.address }, { email: emailPin.email });

  ctx.body = {
    status: 'ok',
    data: 'Email has been confirmed',
  };
};

/**
 *  Confirmation email route
 */
emailRouter.post('/email/new', newEmailHandler);

/**
 * Pin validation route
 */
emailRouter.post('/email/confirm', confirmEmailHandler);

export { emailRouter };
