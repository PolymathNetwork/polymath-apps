import BigNumber from 'bignumber.js';
import { isNumber } from 'lodash';
import { DateTime, DateTimeFormatOptions } from 'luxon';

/**
 * Wether a value is a BigNumber instance or not
 * NOTE @RafaelVidaurre: We cannot use instanceof here since we are handling
 * multiple versions of BigNumber
 */
function isBigNumber(value: any): value is BigNumber {
  return typeof value === 'object' && (value.isBigNumber || value._isBigNumber);
}

/**
 * Converts a number to a string formatted representing dollars
 *
 * @param value number to convert
 * @param options.decimals amount of decimals to display
 */
export const toUSD = (
  value: number | BigNumber,
  { decimals = 2 }: { decimals?: number } = {}
) => {
  const isValid = value !== null && (isNumber(value) || isBigNumber(value));
  if (!isValid) {
    return `- USD`;
  }
  const num = new BigNumber(value);
  return `${num.toFormat(decimals)} USD`;
};

/**
 * Converts a number into a percentage
 *
 * @param value number to convert
 * @param options.decimals amount of decimals to display
 */
export const toPercent = (
  value: number | BigNumber,
  { decimals = 2 }: { decimals?: number } = {}
) => {
  const isValid = value !== null && (isNumber(value) || isBigNumber(value));

  if (!isValid) {
    return '- %';
  }

  const parsedValue = new BigNumber(value);

  return parsedValue
    .toNumber()
    .toLocaleString('en-US', {
      style: 'percent',
      minimumSignificantDigits: decimals,
    });
};

/**
 * Converts a number into a string representing an amount of tokens
 *
 * @param value number to convert
 * @param options.decimals amount of decimals to display
 */
export const toTokens = (
  value: number | BigNumber,
  { decimals = 1 }: { decimals?: number } = {}
) => {
  const isValid = value !== null && (isNumber(value) || isBigNumber(value));
  if (!isValid) {
    return `-`;
  }

  let num: BigNumber;

  if (isBigNumber(value)) {
    num = new BigNumber(value);
  } else {
    num = new BigNumber(`${value}`);
  }

  return num.precision(18).decimalPlaces(decimals).toFormat();
};

/**
 * Shortens an address for display purposes
 */
export const toShortAddress = (
  address: string,
  { size = 17 }: { size?: number } = {}
) => {
  const minSize = 5;
  if (size < minSize) {
    throw new Error('Cannot shortify an address to less than 5 characters');
  }
  const portionSize = Math.floor((size - 3) / 2);
  const remainder = ((size - 3) / 2) % 1 !== 0 ? 1 : 0;

  return `${address.substring(0, portionSize + remainder)}...${address.slice(
    -portionSize
  )}`;
};

export const date = DateTime;

export const toDateFormat = (
  inputDate: Date,
  { format = DateTime.DATE_FULL }: { format?: DateTimeFormatOptions } = {}
) => DateTime.fromJSDate(inputDate).toLocaleString(format);

export const toTimeFormat = (
  inputDate: Date,
  { format = DateTime.TIME_SIMPLE }: { format?: DateTimeFormatOptions } = {}
) => DateTime.fromJSDate(inputDate).toLocaleString(format);
