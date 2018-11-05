import BigNumber from 'bignumber.js';

import * as format from '../format';

describe('formatters', () => {
  describe('toDollars', () => {
    test('correctly formats to dollars', () => {
      expect(format.toDollars(1000.43)).toEqual('1,000.43 USD');
    });

    test('supports amount of decimals', () => {
      expect(format.toDollars(100.1234, { decimals: 1 })).toEqual('100.1 USD');
      expect(format.toDollars(10000.444444, { decimals: 5 })).toEqual(
        '10,000.44444 USD'
      );
    });

    test('supports BigNumber instances', () => {
      expect(format.toDollars(new BigNumber('100000000.432'))).toEqual(
        '100,000,000.43 USD'
      );
    });
  });

  describe('toPercent', () => {
    test('correctly formats a number into a percentage', () => {
      expect(format.toPercent(0.12)).toEqual('12 %');
    });

    test('supports percentages over 100', () => {
      expect(format.toPercent(12.43)).toEqual('1,243 %');
    });

    test('supports decimals', () => {
      expect(format.toPercent(0.43443, { decimals: 3 })).toEqual('43.443 %');
    });
  });

  describe('toTokens', () => {
    test('correctly formats a number', () => {
      expect(format.toTokens(0.1234, { decimals: 1 })).toEqual('0.1');
      expect(format.toTokens(12.43, { decimals: 0 })).toEqual('12');
      expect(format.toTokens(12345.43, { decimals: 2 })).toEqual('12,345.43');
    });
  });
});
