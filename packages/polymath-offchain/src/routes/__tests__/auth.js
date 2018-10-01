import '../../startup/setupEnvironment';

import { getCodeHandler, authHandler } from '../auth.js';
import { AuthCode } from '../../models';
import { TYPED_NAME } from '../../constants';
import crypto from 'crypto';

jest.mock('../../models/AuthCode', () => {
  return {
    AuthCode: {
      create: jest.fn(),
    },
  };
});

jest.mock('crypto', () => {
  return {
    randomBytes: jest.fn(),
  };
});

describe('Route: /verification-code/:address', () => {
  test('responds with an error if address is invalid', async () => {
    const ctx = {
      params: {
        address: 1, // expects string
      },
    };

    await getCodeHandler(ctx);

    expect(ctx.body).toEqual({
      status: 'error',
      data: 'Invalid request parameters',
    });
  });
  test('creates AuthCode document', async () => {
    const expectedAddress = '0x0678d1Ed145DDF85eBA179AD235dA695536352b6';
    const ctx = {
      params: {
        address: expectedAddress,
      },
    };

    const expectedCode = '40c457784dc614d0';

    crypto.randomBytes.mockImplementationOnce(() => {
      // console.log('MOCKING');
      const buffer = Buffer.from(expectedCode, 'hex');
      // console.log(buffer);
      return buffer;
    });

    // const result = crypto.randomBytes(8);

    // console.log(result.toString('hex'));

    await getCodeHandler(ctx);

    const call = AuthCode.create.mock.calls[0];

    expect(call[0]).toEqual({
      code: expectedCode,
      address: expectedAddress.toLowerCase(),
    });
  });
  test('responds with signing data');
});
