// @flow

import {
  ecrecover,
  fromRpcSig,
  hashPersonalMessage,
  publicToAddress,
} from 'ethereumjs-util';
import sigUtil from 'eth-sig-util';

/**
  TODO: annotate and document this file. Right now use as-is
  since I'm not terribly familiar with the ETH standard
 */

export const typedName = 'Verification code from the Polymath server';

const recoverNormal = (message, sig) => {
  const msgHash = hashPersonalMessage(new Buffer(message, 'utf8'));
  const sigObj = fromRpcSig(sig);
  const publicKey = ecrecover(msgHash, sigObj.v, sigObj.r, sigObj.s);
  return '0x' + publicToAddress(publicKey).toString('hex');
};

export default (value, sig, address) => {
  const typed = [{ type: 'string', name: typedName, value }];
  if (
    sigUtil.recoverTypedSignature({ data: typed, sig }).toLowerCase() ===
    address.toLowerCase()
  ) {
    return true;
  }

  return (
    recoverNormal(value, sig, address).toLowerCase() === address.toLowerCase()
  );
};
