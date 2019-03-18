import Web3 from 'web3';

export type ValidatorFn = (value: any) => boolean;

export const isNotEmpty = (value: any) =>
  value !== '' && value !== null && typeof value !== 'undefined';

export const isString = (value: any) => typeof value === 'string';

export const isNumber = (value: any) => typeof parseInt(value, 10) === 'number';

export const isLowerThan = (max: number) => (value: any) =>
  parseInt(value, 10) < max;

export const isGreaterThan = (min: number) => (value: any) =>
  parseInt(value, 10) > min;

export const isLowerThanOrEquals = (max: number) => (value: any) =>
  parseInt(value, 10) <= max;

export const isGreaterThanOrEquals = (min: number) => (value: any) =>
  parseInt(value, 10) >= min;

export const isInt = (value: any) => Number.isInteger(value);

export const isEthereumAddress = (value: any) => Web3.utils.isAddress(value);

export const isDate = (value: any) =>
  new Date(value).toString() !== 'Invalid Date';
