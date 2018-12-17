import Web3 from 'web3';
import BigNumber from 'bignumber.js';

export function toUnixTimestamp(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

export function fromUnixTimestamp(timestamp: number) {
  return new Date(timestamp * 1000);
}

export function fromWei(value: number) {
  return new BigNumber(Web3.utils.fromWei(String(value)));
}

export function toWei(value: number) {
  return new BigNumber(Web3.utils.toWei(String(value)));
}
