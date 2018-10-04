import { newEmailHandler, confirmEmailHandler } from '../email.js';
import { verifySignature } from '../../utils';
import { EmailPIN, User } from '../../models';
import crypto from 'crypto';
import { sendAccountConfirmationEmail } from '../../utils';

jest.mock('../../utils', () => {
  return {
    verifySignature: jest.fn(),
    sendAccountConfirmationEmail: jest.fn(),
  };
});

jest.mock('../../models/EmailPIN', () => {
  return {
    EmailPIN: {
      create: jest.fn(),
      findOneAndUpdate: jest.fn(),
    },
  };
});

jest.mock('../../models/User', () => {
  return {
    User: {
      update: jest.fn(),
    },
  };
});

jest.mock('crypto');

// TODO @monitz87: refactor this into a helper function that can be imported in other suites
const generateInvalidRequestBodyTest = (body, handler) => {
  return async () => {
    const ctx = {
      request: {
        body,
      },
    };

    await handler(ctx);

    expect(ctx.body).toEqual({
      status: 'error',
      data: 'Invalid request body',
    });
  };
};

describe('Route: POST /email/new', () => {
  const validEmail = 'jeremias@polymath.network';
  const validName = 'Jeremías Díaz';
  const validCode = '40c457784dc614d0';
  const validAddress = '0x0678d1Ed145DDF85eBA179AD235dA695536352b6';
  const validSig =
    '0xc69e7dbed9982c5b68663824e346ab5d52f60265474bc21d4c82b77f01884cca225adc4299e18446509ede2c29c939da32e29230e239e92fbf88de7caff849231c';
  const validBody = {
    email: validEmail,
    name: validName,
    code: validCode,
    sig: validSig,
    address: validAddress,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  test(
    'responds with an error if the request body is not an object',
    generateInvalidRequestBodyTest(1, newEmailHandler)
  );

  test(
    'responds with an error if email is not a string',
    generateInvalidRequestBodyTest(
      {
        email: 1,
        name: validName,
        code: validCode,
        sig: validSig,
        address: validAddress,
      },
      newEmailHandler
    )
  );

  test(
    'responds with an error if name is not a string',
    generateInvalidRequestBodyTest(
      {
        email: validEmail,
        name: 1,
        code: validCode,
        sig: validSig,
        address: validAddress,
      },
      newEmailHandler
    )
  );

  test(
    'responds with an error if code is not a string',
    generateInvalidRequestBodyTest(
      {
        email: validEmail,
        name: validName,
        code: 1,
        sig: validSig,
        address: validAddress,
      },
      newEmailHandler
    )
  );

  test(
    'responds with an error if sig is not a string',
    generateInvalidRequestBodyTest(
      {
        email: validEmail,
        name: validName,
        code: validCode,
        sig: 1,
        address: validAddress,
      },
      newEmailHandler
    )
  );

  test(
    'responds with an error if address is not a string',
    generateInvalidRequestBodyTest(
      {
        email: validEmail,
        name: validName,
        code: validCode,
        sig: validSig,
        address: 1,
      },
      newEmailHandler
    )
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

    await newEmailHandler(ctx);

    expect(ctx.body).toEqual(expectedError);
  });

  test('creates user and emailPIN in database, sends email, responds with ok status', async () => {
    verifySignature.mockImplementation(() => null);

    const validPIN = '40c457784dc614d0';

    crypto.randomBytes.mockImplementation(() => {
      return Buffer.from(validPIN, 'hex');
    });

    const ctx = {
      request: {
        body: validBody,
      },
    };

    await newEmailHandler(ctx);

    expect(EmailPIN.create).toBeCalledWith({
      address: validAddress,
      pin: validPIN,
      email: validEmail,
      isConfirmed: false,
    });

    expect(User.update).toBeCalledWith(
      {
        address: validAddress,
      },
      { name: validName },
      { upsert: true }
    );

    expect(sendAccountConfirmationEmail).toBeCalledWith(
      validEmail,
      validName,
      validPIN
    );

    expect(ctx.body).toEqual({
      status: 'ok',
      data: 'Confirmation email has been sent',
    });
  });
});

describe('Route: POST /email/confirm', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test(
    'responds with an error if the request body is not an object',
    generateInvalidRequestBodyTest(1, confirmEmailHandler)
  );

  test(
    'responds with an error if pin is not a string',
    generateInvalidRequestBodyTest({ pin: 1 }, confirmEmailHandler)
  );

  const validPIN = '40c457784dc614d0';
  const validBody = {
    pin: validPIN,
  };
  test('responds with an error if pin is not in the database or has expired', async () => {
    EmailPIN.findOneAndUpdate.mockImplementation(() => undefined);

    const ctx = {
      request: {
        body: validBody,
      },
    };

    await confirmEmailHandler(ctx);

    expect(EmailPIN.findOneAndUpdate).toBeCalledWith(
      {
        pin: validPIN,
        isConfirmed: false,
        createdAt: { $gte: expect.any(Date) },
      },
      {
        isConfirmed: true,
      }
    );

    expect(ctx.body).toEqual({
      status: 'error',
      data: 'Pin is not valid',
    });
  });

  test('confirms email and responds with ok code', async () => {
    const validAddress = '0x0678d1Ed145DDF85eBA179AD235dA695536352b6';
    const validEmail = 'jeremias@polymath.network';
    const validEmailPIN = {
      pin: validPIN,
      isConfirmed: true,
      createdAt: new Date(0),
      address: validAddress,
      email: validEmail,
    };

    EmailPIN.findOneAndUpdate.mockImplementation(() => {
      return validEmailPIN;
    });

    const ctx = {
      request: {
        body: validBody,
      },
    };

    await confirmEmailHandler(ctx);

    expect(User.update).toHaveBeenCalledWith(
      {
        address: validAddress,
      },
      {
        email: validEmail,
      }
    );

    expect(ctx.body).toEqual({
      status: 'ok',
      data: 'Email has been confirmed',
    });
  });
});
