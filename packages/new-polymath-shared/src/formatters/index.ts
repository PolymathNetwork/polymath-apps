// @flow
import BigNumber from 'bignumber.js';
import numeral from 'numeral';
import { times, isNumber } from 'lodash';

/**
 * Wether a value is a BigNumber instance or not
 * NOTE @RafaelVidaurre: We cannot use instanceof here since we are handling
 * multiple versions of BigNumber
 */
function isBigNumber(value: any) {
  return typeof value === 'object';
}

/**
 * Converts a number to a string formatted representing dollars
 *
 * @param value number to convert
 * @param decimals amount of decimals to display
 */
export const toUSD = (
  value?: number | BigNumber,
  { decimals = 2 }: { decimals: number}
) => {
  const isValid = value !== null && (isNumber(value) || isBigNumber(value));
  if (!isValid) {
    return `- USD`;
  }
  const number = new BigNumber(value);
  return `${number.toFormat(decimals)} USD`;
};

interface ToPercentOpts = {
  decimals: number;
};
/**
 * Converts a number into a percentage
 *
 * @param value number to convert
 * @param decimals amount of decimals to display
 */
export const toPercent = (
  value: number | BigNumber,
  { decimals = 0 }: ToPercentOpts = {}
) => {
  let decimalsFormat = '';
  const isValid = value !== null && (isNumber(value) || isBigNumber(value));

  if (!isValid) {
    return '- %';
  }

  const parsedValue = new BigNumber(value);

  times(decimals, time => {
    if (time === 0) {
      decimalsFormat = '.';
    }
    decimalsFormat += '0';
  });

  return numeral(parsedValue.toFixed()).format(`0,0${decimalsFormat} %`);
};

/**
 * Converts a number into a string representing an amount of tokens
 *
 * @param value number to convert
 * @param decimals amount of decimals to display
 */
export const toTokens = (
  value: number,
  { decimals = 0 }: { decimals: number }
) => {
  const isValid = value !== null && (isNumber(value) || isBigNumber(value));
  if (!isValid) {
    return `-`;
  }
  const num = new BigNumber(value);
  return num.toFormat(decimals);
};
