import * as formatters from '../index';

describe('Formatters', () => {
  describe('toShortAddress', () => {
    test('returns shortified address', () => {
      const res = formatters.toShortAddress(
        '0xfac7f4eaa3a9dd006481db13c808067bbef95c44'
      );

      expect(res).toEqual('0xfac7f...ef95c44');
    });

    test('can be configured in size of shortified address', () => {
      const res = formatters.toShortAddress(
        '0xfac7f4eaa3a9dd006481db13c808067bbef95c44',
        { size: 5 }
      );

      expect(res).toEqual('0...4');
    });

    test('displays even sizes correctly', () => {
      const res = formatters.toShortAddress(
        '0xfac7f4eaa3a9dd006481db13c808067bbef95c44',
        { size: 6 }
      );

      expect(res).toEqual('0x...4');
    });

    test('throws error if size is too small', () => {
      expect(() => {
        formatters.toShortAddress(
          '0xfac7f4eaa3a9dd006481db13c808067bbef95c44',
          { size: 4 }
        );
      }).toThrow();
    });
  });

  describe('toPercent', () => {
    test('returns  pourcentage without decimals', () => {
      const res = formatters.toPercent(0.1);

      expect(res).toEqual('10%');
    });

    test('returns pourcentage with decimals', () => {
      const res = formatters.toPercent(0.1521);

      expect(res).toEqual('15.21%');
    });

    test('returns right pourcentage with small numbers', () => {
      const res = formatters.toPercent(0.0133);

      expect(res).toEqual('1.33%');
    });

    test('returns right pourcentage with 2 decimals', () => {
      const res = formatters.toPercent(0.01);

      expect(res).toEqual('1%');
    });
  });
});
