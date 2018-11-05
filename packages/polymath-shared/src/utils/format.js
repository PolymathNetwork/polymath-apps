// @flow
import BigNumber from 'bignumber.js';

import type { BigNumber as BigNumberType } from 'bignumber.js';

/**
 * Converts a number to a string formatted representing dollars
 *
 * @param value number to convert
 * @param decimals amount of decimals to display
 */
export const toDollars = (
  value: number | BigNumberType,
  decimals: number = 2
) => {
  const number = new BigNumber(value);
  return number.toFormat(decimals);
};

/**
 * Converts a number into a percentage
 *
 * @param value number to convert
 * @param decimals amount of decimals to display
 */
export const toPercent = (value: number, decimals: number = 0) => {
  return (value * 100).toFixed(decimals);
};

/**
 * Converts a number into a string representing an amount of tokens
 *
 * @param value number to convert
 * @param decimals amount of decimals to display
 */
export const toTokens = (value: number, decimals: number = 2) => {
  const number = new BigNumber(value);
  return number.toFormat(decimals);
};
