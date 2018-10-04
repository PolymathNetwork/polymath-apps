import '../../startup/setupEnvironment';

import { verifySignature } from '../sig.js';
import sigUtil from 'eth-sig-util';
import { AuthCode } from '../../models';
import { fromRpcSig, publicToAddress } from 'ethereumjs-util';

jest.mock('eth-sig-util');

jest.mock('ethereumjs-util', () => {
  return {
    ecrecover: jest.fn(),
    fromRpcSig: jest.fn(),
    hashPersonalMessage: jest.fn(),
    publicToAddress: jest.fn(),
  };
});

jest.mock('../../models/AuthCode', () => {
  return {
    AuthCode: {
      findOne: jest.fn(),
    },
  };
});

describe('Function: verifySignature', () => {
  const returnValidAuthCode = () => {
    return {
      code: validCode,
      address: validAddress.toLowerCase(),
    };
  };

  const validAddress = '0xf55bcAA8a8AcF4aBA2edF74A50509358B96155b0';
  const validCode = 'c2dccbea5e17e2b4';
  const validSig =
    '0xc69e7dbed9982c5b68663824e346ab5d52f60265474bc21d4c82b77f01884cca225adc4299e18446509ede2c29c939da32e29230e239e92fbf88de7caff849231c';

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("returns an error object if code and address don't match", async () => {
    AuthCode.findOne.mockImplementationOnce(() => undefined);

    expect(await verifySignature(validCode, validSig, validAddress)).toEqual({
      status: 'error',
      data: 'Code is not valid',
    });
  });

  const returnDummySigObj = () => {
    return {
      v: 1,
      r: 1,
      s: 1,
    };
  };

  test('returns an error object if signature is invalid', async () => {
    AuthCode.findOne.mockImplementationOnce(returnValidAuthCode);

    sigUtil.recoverTypedSignature.mockImplementationOnce(() => {
      throw new Error('Something is amiss');
    });

    fromRpcSig.mockImplementationOnce(returnDummySigObj);

    expect(await verifySignature(validCode, validSig, validAddress)).toEqual({
      status: 'error',
      data: 'Sig is not valid',
    });

    AuthCode.findOne.mockImplementationOnce(returnValidAuthCode);

    // incompatible address
    sigUtil.recoverTypedSignature.mockImplementationOnce(() => {
      return '1';
    });

    fromRpcSig.mockImplementationOnce(returnDummySigObj);

    expect(await verifySignature(validCode, validSig, validAddress)).toEqual({
      status: 'error',
      data: 'Sig is not valid',
    });
  });

  /**
    Check if valid using EIP712, then if not, check if valid using legacy signing
   */
  test('returns null if signature is valid', async () => {
    AuthCode.findOne.mockImplementationOnce(returnValidAuthCode);

    // valid address
    sigUtil.recoverTypedSignature.mockImplementationOnce(() => validAddress);

    expect(await verifySignature(validCode, validSig, validAddress)).toBe(null);

    AuthCode.findOne.mockImplementationOnce(returnValidAuthCode);

    // invalid address
    sigUtil.recoverTypedSignature.mockImplementationOnce(() => 1);

    fromRpcSig.mockImplementationOnce(returnDummySigObj);

    publicToAddress.mockImplementationOnce(() =>
      validAddress.replace(/^0x/, '')
    );

    expect(await verifySignature(validCode, validSig, validAddress)).toBe(null);
  });
});
