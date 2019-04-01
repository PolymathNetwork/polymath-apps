import Web3 from 'web3';
import { isNumber as isANumber } from 'lodash';

export type ValidatorFn = (value: any) => boolean;

export const isNotEmpty = (value: any) =>
  value !== '' && value !== null && typeof value !== 'undefined';

export const isString = (value: any): value is string =>
  typeof value === 'string';

export const isInt = (value: any): value is number => Number.isInteger(value);

export const isNumber = (value: any): value is number => isANumber(value);

interface NumericalityOpts {
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
}

export const numericality = ({ gt, gte, lt, lte }: NumericalityOpts) => (
  value: number
) => {
  if (gt !== undefined && value <= gt) {
    return false;
  }

  if (gte !== undefined && value < gte) {
    return false;
  }

  if (lt !== undefined && value >= lt) {
    return false;
  }

  if (lte !== undefined && value > lte) {
    return false;
  }

  return true;
};

export const isEthereumAddress = (value: any) => Web3.utils.isAddress(value);

export const isDate = (value: any) =>
  new Date(value).toString() !== 'Invalid Date';
