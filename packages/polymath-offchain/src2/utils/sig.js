// @flow

import {
  ecrecover,
  fromRpcSig,
  hashPersonalMessage,
  publicToAddress,
} from 'ethereumjs-util';
import sigUtil from 'eth-sig-util';
import { AuthCode } from '../models';
import { TYPED_NAME } from '../constants';

/**
  TODO @monitz87: annotate and document this file. Right now use as-is
  since I'm not terribly familiar with the ETH standard
 */

const recoverNormal = (message, sig) => {
  const msgHash = hashPersonalMessage(new Buffer(message, 'utf8'));
  const sigObj = fromRpcSig(sig);
  const publicKey = ecrecover(msgHash, sigObj.v, sigObj.r, sigObj.s);
  return '0x' + publicToAddress(publicKey).toString('hex');
};

const isValidSig = (value: string, sig: string, address: string) => {
  const typed = [{ type: 'string', name: TYPED_NAME, value }];
  if (
    sigUtil.recoverTypedSignature({ data: typed, sig }).toLowerCase() ===
    address.toLowerCase()
  ) {
    return true;
  }

  return recoverNormal(value, sig).toLowerCase() === address.toLowerCase();
};

/**
  Check if a client trying to authenticate has signed the verification code and if the signature is valid

  @param {string} code polymath verification code
  @param {string} sig signature
  @param {string} address client ethereum address

  @returns {Promise} promise that resolves to null if the signature is valid, or an object describing the error if it is not
 */
export const verifySignature = async (
  code: string,
  sig: string,
  address: string
) => {
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
