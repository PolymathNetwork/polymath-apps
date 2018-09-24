// @flow

import Router from 'koa-router';
import crypto from 'crypto';

import { AuthCode, EmailPIN, User } from '../models';
import { verifySignature } from '../utils';
import { TYPED_NAME } from '../constants';

const authRouter = new Router();

/**
  Route for beginning authentication. The client provides his
  ethereum address. A random code is assigned to the address for signing
  and return it to the client in a JSON with the typed message he has to sign
  and the generated code
 */
authRouter.get('/auth/:address', async ctx => {
  const code = (await crypto.randomBytes(8)).toString('hex');
  await AuthCode.create({ address: ctx.params.address.toLowerCase(), code });
  const data = {
    typedName: TYPED_NAME,
    code,
  };

  ctx.body = {
    status: 'ok',
    data,
  };
});

/**
  Route that handles authentication. If the client didn't sign the verification code or the signature is not valid,
  the response will contain an error.
  
  Otherwise, if the client previously confirmed his email via PIN, the response
  will contain the client's email and name, signaling the dApps to allow access.

  If the client hasn't confirmed his email, the response will be null, signaling that the 
  email confirmation process has to begin before the client can be granted access.
 */
authRouter.post('/auth', async ctx => {
  const { code, sig, address } = ctx.request.body;

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
});

export { authRouter };
