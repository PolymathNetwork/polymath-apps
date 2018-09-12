// @flow

import Router from 'koa-router';
import crypto from 'crypto';

import AuthCode from '../models/AuthCode';
import EmailPIN from '../models/EmailPIN';
import User from '../models/User';
import isValidSig, { typedName } from '../sig';

const router = new Router();

router.get('/auth/name', ctx => {
  ctx.body = {
    status: 'ok',
    data: typedName,
  };
});

router.get('/auth/:address', async ctx => {
  const code = (await crypto.randomBytes(8)).toString('hex');
  await AuthCode.create({ address: ctx.params.address.toLowerCase(), code });
  ctx.body = {
    status: 'ok',
    data: code,
  };
});

router.post('/auth', async ctx => {
  const { code, sig, address } = ctx.request.body;

  const error = await auth(code, sig, address);
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

export const auth = async (code: string, sig: string, address: string) => {
  const authCode = await AuthCode.findOne({
    code,
    address: address.toLowerCase(),
  });
  if (!authCode) {
    return {
      status: 'error',
      data: 'Code is not valid',
    };
  }

  if (!isValidSig(code, sig, address)) {
    return {
      status: 'error',
      data: 'Sig is not valid',
    };
  }

  return null;
};

export default router;
