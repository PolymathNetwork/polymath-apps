import Web3 from 'web3';

export type ValidatorFn = (value: any) => boolean;

export const isNotEmpty = (value: any) =>
  value !== '' && value !== null && typeof value !== 'undefined';

export const isString = (value: any) => typeof value === 'string';

export const isInt = (value: any) => Number.isInteger(value);

export const isAddress = (value: any) => {
  const web3 = new Web3();
  return web3.utils.isAddress(value);
};

export const isDate = (value: any) =>
  new Date(value).toString() !== 'Invalid Date';
