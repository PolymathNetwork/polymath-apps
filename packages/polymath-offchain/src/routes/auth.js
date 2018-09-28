// @flow

import Router from 'koa-router';
import crypto from 'crypto';

import { AuthCode, EmailPIN, User } from '../models';
import { verifySignature } from '../utils';
import { TYPED_NAME } from '../constants';

import type { Context } from 'koa';

const authRouter = new Router();

type AuthSetupRequestParams = {|
  address: string,
|};

type AuthRequestBody = {|
  address: string,
  code: string,
  sig: string,
|};

/**
  Validates that the request parameters are typed correctly

  TODO @monitz87: add value validations as well
 */
const isAuthSetupRequestValid = (params: AuthSetupRequestParams | any) => {
  if (typeof params !== 'object') {
    return false;
  }

  const { address } = params;

  return address && typeof address === 'string';
};

/**
  Validates that the request parameters are typed correctly

  TODO @monitz87: add value validations as well
 */
const isAuthRequestValid = (body: AuthRequestBody | any) => {
  if (typeof body !== 'object') {
    return false;
  }

  const { address, code, sig } = body;

  return (
    address &&
    typeof address === 'string' &&
    code &&
    typeof code === 'string' &&
    sig &&
    typeof sig === 'string'
  );
};

/**
  GET /auth/:address

  Auth setup route handler. The client provides his
  ethereum address. A random code is assigned to the address 
  for signing and is returned to the client in a JSON along 
  with the typed message he has to sign.

  @param {string} address client's ethereum address
 */
const getCodeHandler = async (ctx: Context) => {
  const code = crypto.randomBytes(8).toString('hex');
  let params = ctx.params;

  if (!isAuthSetupRequestValid(params)) {
    ctx.body = {
      status: 'error',
      data: 'Invalid request parameters',
    };
    return;
  }

  params = (params: AuthSetupRequestParams);
  await AuthCode.create({ address: params.address.toLowerCase(), code });
  const data = {
    typedName: TYPED_NAME,
    code,
  };

  ctx.body = {
    status: 'ok',
    data,
  };
};

/**
  Auth setup route
 */
authRouter.get('/auth/:address', getCodeHandler);

/**
  POST /auth

  Auth route handler. If the client didn't sign the verification 
  code or the signature is not valid, the response will contain an error.
  
  Otherwise, if the client previously confirmed his email via PIN, the response
  will contain the client's email and name, signaling the dApps to allow access.

  If the client hasn't confirmed his email, the response will be null, signaling that the 
  email confirmation process has to begin before the client can be granted access.

  @param {string} code polymath verification code
  @param {string} sig signature
  @param {string} address issuer ethereum address
 */
const authHandler = async (ctx: Context) => {
  let body = ctx.request.body;

  if (!isAuthRequestValid(body)) {
    ctx.body = {
      status: 'error',
      data: 'Invalid request parameters',
    };
    return;
  }

  body = ((body: any): AuthRequestBody);

  const { code, sig, address } = body;

  const error = await verifySignature(code, sig, address);
  if (error) {
    ctx.body = error;
    return;
  }

  const user = await User.findOne({ address });
  let data = null;
  if (user) {
    const isConfirmed = await EmailPIN.findOne({
      address,
      email: user.email,
      isConfirmed: true,
    });
    if (isConfirmed) {
      data = {
        name: user.name,
        email: user.email,
      };
    }
  }
  ctx.body = {
    status: 'ok',
    data,
  };
};

/**
  Authentication route
 */
authRouter.post('/auth', authHandler);

export { authRouter };
