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
});
