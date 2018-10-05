import { getCodeHandler, authHandler } from '../auth.js';
import { AuthCode, EmailPIN, User } from '../../models';
import { TYPED_NAME } from '../../constants';
import { verifySignature } from '../../utils';
import crypto from 'crypto';

jest.mock('../../models/AuthCode', () => {
  return {
    AuthCode: {
      create: jest.fn(),
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

jest.mock('../../utils/sig', () => {
  return {
    verifySignature: jest.fn(),
  };
});

jest.mock('crypto');

describe('Route: GET /verification-code/:address', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

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

  const validAddress = '0x0678d1Ed145DDF85eBA179AD235dA695536352b6'.toLowerCase();
  const validCode = '40c457784dc614d0';

  const returnCodeBuffer = () => {
    return Buffer.from(validCode, 'hex');
  };

  test('creates AuthCode document', async () => {
    const ctx = {
      params: {
        address: validAddress,
      },
    };

    crypto.randomBytes.mockImplementation(returnCodeBuffer);

    await getCodeHandler(ctx);

    expect(AuthCode.create).toHaveBeenCalledWith({
      address: validAddress,
      code: validCode,
    });
  });

  test('responds with signing data', async () => {
    const ctx = {
      params: {
        address: validAddress,
      },
    };

    crypto.randomBytes.mockImplementation(returnCodeBuffer);

    await getCodeHandler(ctx);

    expect(ctx.body).toEqual({
      status: 'ok',
      data: {
        typedName: TYPED_NAME,
        code: validCode,
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

  const validAddress = '0xf55bcAA8a8AcF4aBA2edF74A50509358B96155b0';
  const validCode = 'c2dccbea5e17e2b4';
  const validSig =
    '0xc69e7dbed9982c5b68663824e346ab5d52f60265474bc21d4c82b77f01884cca225adc4299e18446509ede2c29c939da32e29230e239e92fbf88de7caff849231c';
  const validBody = {
    address: validAddress,
    code: validCode,
    sig: validSig,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  test(
    'responds with an error if request body is not an object',
    generateInvalidRequestBodyTest(1)
  );

  test(
    'responds with an error if address is not a string',
    generateInvalidRequestBodyTest({
      address: 1,
      code: validCode,
      sig: validSig,
    })
  );

  test(
    'responds with an error if code is not a string',
    generateInvalidRequestBodyTest({
      address: validAddress,
      code: 1,
      sig: validSig,
    })
  );

  test(
    'responds with an error if signature is not a string',
    generateInvalidRequestBodyTest({
      address: validAddress,
      code: validCode,
      sig: 1,
    })
  );

  test("responds with an error if signature can't be verified", async () => {
    const expectedError = {
      status: 'error',
      data: 'Some signing error',
    };

    verifySignature.mockImplementation(() => expectedError);

    const ctx = {
      request: {
        body: validBody,
      },
    };

    await authHandler(ctx);

    expect(ctx.body).toEqual(expectedError);
  });

  const validName = 'Jeremías Díaz';
  const validEmail = 'jeremias@polymath.network';
  const validUser = {
    name: validName,
    email: validEmail,
  };

  const nullData = {
    status: 'ok',
    data: null,
  };

  const returnValidUser = () => validUser;
  const returnNull = () => null;

  test('responds with user data if the user has verified their email', async () => {
    verifySignature.mockImplementation(returnNull);

    User.findOne.mockImplementation(returnValidUser);

    EmailPIN.findOne.mockImplementation(() => {
      return {
        address: validAddress,
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
    verifySignature.mockImplementation(returnNull);

    User.findOne.mockImplementation(returnValidUser);

    EmailPIN.findOne.mockImplementation(() => undefined);

    const ctx = {
      request: {
        body: validBody,
      },
    };

    await authHandler(ctx);

    expect(ctx.body).toEqual(nullData);
  });

  test("responds with null if the user doesn't exist in the database", async () => {
    verifySignature.mockImplementation(returnNull);

    User.findOne.mockImplementation(() => undefined);

    const ctx = {
      request: {
        body: validBody,
      },
    };

    await authHandler(ctx);

    expect(ctx.body).toEqual(nullData);
  });
});
