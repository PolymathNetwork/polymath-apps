import '../../startup/setupEnvironment';

import { getCodeHandler, authHandler } from '../auth.js';
import { AuthCode, EmailPIN, User } from '../../models';
import { TYPED_NAME } from '../../constants';
import crypto from 'crypto';

jest.mock('../../models/AuthCode', () => {
  return {
    AuthCode: {
      create: jest.fn(),
      findOne: jest.fn(),
    },
  };
});

jest.mock('../../models/EmailPIN', () => {
  return {
    EmailPIN: {
      findOne: jest.fn(),
    },
  };
});

jest.mock('../../models/User', () => {
  return {
    User: {
      findOne: jest.fn(),
    },
  };
});

jest.mock('crypto');

describe('Route: GET /verification-code/:address', () => {
  test('responds with an error if request params is not an object', async () => {
    const ctx = {
      params: 1,
    };

    await getCodeHandler(ctx);

    expect(ctx.body).toEqual({
      status: 'error',
      data: 'Invalid request parameters',
    });
  });

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
    const expectedAddress = '0x0678d1Ed145DDF85eBA179AD235dA695536352b6'.toLowerCase();
    const ctx = {
      params: {
        address: expectedAddress,
      },
    };

    const expectedCode = '40c457784dc614d0';

    crypto.randomBytes.mockImplementationOnce(() => {
      return Buffer.from(expectedCode, 'hex');
    });

    await getCodeHandler(ctx);

    expect(AuthCode.create).toHaveBeenCalledWith({
      address: expectedAddress,
      code: expectedCode,
    });
  });

  test('responds with signing data', async () => {
    const expectedAddress = '0x0678d1Ed145DDF85eBA179AD235dA695536352b6'.toLowerCase();
    const ctx = {
      params: {
        address: expectedAddress,
      },
    };

    const expectedCode = '40c457784dc614d0';

    crypto.randomBytes.mockImplementationOnce(() => {
      return Buffer.from(expectedCode, 'hex');
    });

    await getCodeHandler(ctx);

    expect(ctx.body).toEqual({
      status: 'ok',
      data: {
        typedName: TYPED_NAME,
        code: expectedCode,
      },
    });
  });
});

describe('Route: POST /auth', () => {
  const generateInvalidRequestBodyTest = body => {
    return async () => {
      const ctx = {
        request: {
          body,
        },
      };

      await authHandler(ctx);

      expect(ctx.body).toEqual({
        status: 'error',
        data: 'Invalid request body',
      });
    };
  };

  const validBody = {
    address: '0xf55bcAA8a8AcF4aBA2edF74A50509358B96155b0',
    code: 'c2dccbea5e17e2b4',
    sig:
      '0xc69e7dbed9982c5b68663824e346ab5d52f60265474bc21d4c82b77f01884cca225adc4299e18446509ede2c29c939da32e29230e239e92fbf88de7caff849231c',
  };

  const returnValidAuthCode = () => {
    return {
      code: validBody.code,
      address: validBody.address.toLowerCase(),
    };
  };

  test(
    'responds with an error if request body is not an object',
    generateInvalidRequestBodyTest(1)
  );

  test(
    'responds with an error if address is not a string',
    generateInvalidRequestBodyTest({
      address: 1,
      code: validBody.code,
      sig: validBody.sig,
    })
  );

  test(
    'responds with an error if code is not a string',
    generateInvalidRequestBodyTest({
      address: validBody.address,
      code: 1,
      sig: validBody.sig,
    })
  );

  test(
    'responds with an error if signature is not a string',
    generateInvalidRequestBodyTest({
      address: validBody.address,
      code: validBody.code,
      sig: 1,
    })
  );

  test("responds with an error if code and address don't match", async () => {
    // no AuthCode matching that code and address in the database
    AuthCode.findOne.mockImplementationOnce(() => undefined);

    const ctx = {
      request: {
        body: validBody,
      },
    };

    await authHandler(ctx);

    expect(ctx.body).toEqual({
      status: 'error',
      data: 'Code is not valid',
    });
  });

  test('responds with an error if signature is invalid', async () => {
    AuthCode.findOne.mockImplementationOnce(returnValidAuthCode);

    const ctx = {
      request: {
        body: {
          code: validBody.code,
          address: validBody.address,
          sig: validBody.sig.replace('6', '5'),
        },
      },
    };

    await authHandler(ctx);

    expect(ctx.body).toEqual({
      status: 'error',
      data: 'Sig is not valid',
    });
  });

  const validName = 'Jeremías Díaz';
  const validEmail = 'jeremias@polymath.network';
  const validUser = {
    name: validName,
    email: validEmail,
  };

  const returnValidUser = () => validUser;

  test('responds with user data if the user has verified their email', async () => {
    AuthCode.findOne.mockImplementationOnce(returnValidAuthCode);

    User.findOne.mockImplementationOnce(returnValidUser);

    EmailPIN.findOne.mockImplementationOnce(() => {
      return {
        address: validBody.address,
        email: validEmail,
        isConfirmed: true,
      };
    });

    const ctx = {
      request: {
        body: validBody,
      },
    };

    await authHandler(ctx);

    expect(ctx.body).toEqual({
      status: 'ok',
      data: validUser,
    });
  });

  test("responds with null if the user hasn't verified their email", async () => {
    AuthCode.findOne.mockImplementationOnce(returnValidAuthCode);

    User.findOne.mockImplementationOnce(returnValidUser);

    EmailPIN.findOne.mockImplementationOnce(() => undefined);

    const ctx = {
      request: {
        body: validBody,
      },
    };

    await authHandler(ctx);

    expect(ctx.body).toEqual({
      status: 'ok',
      data: null,
    });
  });
});
