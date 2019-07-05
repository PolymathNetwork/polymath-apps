import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { Tx, TransactionObject } from 'web3/eth/types';
import { web3 } from '../LowLevel/web3Client';

const { utils } = Web3;

export function toUnixTimestamp(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

export function fromUnixTimestamp(timestamp: number) {
  return new Date(timestamp * 1000);
}

export function fromWei(value: number | string) {
  return new BigNumber(utils.fromWei(String(value)));
}

export function fromDivisible(value: number | string, decimals: number) {
  const factor = new BigNumber(10).exponentiatedBy(decimals);

  return new BigNumber(value).div(factor);
}

export function toWei(value: number | BigNumber) {
  let stringValue: string;

  if (typeof value === 'number') {
    stringValue = String(value);
  } else {
    stringValue = value.toFormat().replace(/,/g, '');
  }

  return new BigNumber(utils.toWei(stringValue));
}

export function toDivisible(value: number | BigNumber, decimals: number) {
  let stringValue: string;

  if (typeof value === 'number') {
    stringValue = String(value);
  } else {
    stringValue = value.toFormat().replace(/,/g, '');
  }

  const factor = new BigNumber(10).exponentiatedBy(decimals);

  const result = new BigNumber(stringValue).times(factor);

  if (result.decimalPlaces() > 0) {
    throw new Error(
      `Supplied number has more than ${decimals} decimal places. This will result on a web3 error. Check that you're sending the correct values.`
    );
  }

  return result;
}

// Remove `NULL` characters from bytes32 fields generating empty squares on some browsers.
export function toAscii(value: string) {
  return utils.toAscii(value).replace(/\u0000/g, '');
}

export function fromAscii(value: string) {
  return utils.fromAscii(value);
}

export function toChecksumAddress(value: string) {
  return utils.toChecksumAddress(value);
}

export function isAddress(value: string) {
  return utils.isAddress(value);
}

export function asciiToHex(value: string) {
  return utils.asciiToHex(value);
}

export const version = {
  pack: (major: number, minor: number, patch: number) => {
    const packedVersion = (major << 16) | (minor << 8) | patch;
    return packedVersion;
  },
};

/**
 * Given web3 method and options object, this function will modify options with the following:
 * - An incremented nonce
 * - Current network gas price
 * - Estimated gas limit
 */
export async function getOptions(method: TransactionObject<void>, options: Tx) {
  const block = await web3.eth.getBlock('latest');
  const networkGasLimit = block.gasLimit;
  options.gasPrice = options.gasPrice || (await web3.eth.getGasPrice());
  if (options.from) {
    options.nonce = options.nonce || (await web3.eth.getTransactionCount(options.from));
  }
  if (!options.gas) {
    const gasLimit = Math.floor((await method.estimateGas(options)) * 1.2);
    // Do not exceed block gas limit.
    if (gasLimit < networkGasLimit) options.gas = gasLimit;
  }
  return options;
}
