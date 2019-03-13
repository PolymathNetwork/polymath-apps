import Web3 from 'web3';
import BigNumber from 'bignumber.js';

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

export function toWei(value: number | BigNumber) {
  let stringValue: string;

  if (typeof value === 'number') {
    stringValue = String(value);
  } else {
    stringValue = value.toFormat().replace(/,/g, '');
  }

  return new BigNumber(utils.toWei(stringValue));
}

export function isAddress(value: string) {
  return utils.isAddress(value);
}
