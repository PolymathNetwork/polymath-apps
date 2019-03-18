import * as validators from '../validators';

describe('Validator', () => {
  describe('.isString', () => {
    test('tests strings correctly', () => {
      expect(validators.isString('hi there')).toBe(true);
      expect(validators.isString(1)).toBe(false);
    });
  });

  describe('.isNumber', () => {
    test('tests numbers correctly', () => {
      expect(validators.isInt('hi there')).toBe(false);
      expect(validators.isInt(1)).toBe(true);
    });
  });

  describe('.isEthereumAddress', () => {
    test('tests addresses correctly', () => {
      expect(
        validators.isEthereumAddress(
          '0x07889A89C6854bb4Ec445825E680255b17751192'
        )
      ).toBe(true);
      expect(
        validators.isEthereumAddress(
          '0x07889A89C6854bb4Ec445825E680255b17751193'
        )
      ).toBe(false);
    });
  });

  describe('.isNotEmpty', () => {
    test('tests isNotEmpty correctly', () => {
      expect(validators.isNotEmpty('')).toBe(false);
      expect(validators.isNotEmpty('test')).toBe(true);
      expect(validators.isNotEmpty(null)).toBe(false);
    });
  });

  describe('.isDate', () => {
    test('tests dates correctly', () => {
      expect(validators.isDate('1/1/2019')).toBe(true);
      expect(validators.isDate('22/22/2019')).toBe(false);
    });
  });

  describe('.numericality', () => {
    test('correctly tests gt', () => {
      expect(validators.numericality({ gt: 5 })(4)).toBe(false);
      expect(validators.numericality({ gt: 3 })(4)).toBe(true);
      expect(validators.numericality({ gt: 2 })(2)).toBe(false);
    });

    test('correctly tests gte', () => {
      expect(validators.numericality({ gte: 5 })(4)).toBe(false);
      expect(validators.numericality({ gte: 2 })(2)).toBe(true);
      expect(validators.numericality({ gte: 2 })(4)).toBe(true);
    });

    test('correctly tests lt', () => {
      expect(validators.numericality({ lt: 2 })(3)).toBe(false);
      expect(validators.numericality({ lt: 4 })(2)).toBe(true);
      expect(validators.numericality({ lt: 2 })(2)).toBe(false);
    });

    test('correctly tests lte', () => {
      expect(validators.numericality({ lte: 2 })(4)).toBe(false);
      expect(validators.numericality({ lte: 2 })(2)).toBe(true);
      expect(validators.numericality({ lte: 10 })(2)).toBe(true);
    });
  });
});
