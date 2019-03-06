import * as validators from '../validators';

describe('Validator', () => {
  test('tests strings correctly', () => {
    expect(validators.isString('hi there')).toBe(true);
    expect(validators.isString(1)).toBe(false);
  });
  test('tests numbers correctly', () => {
    expect(validators.isInt('hi there')).toBe(false);
    expect(validators.isInt(1)).toBe(true);
  });
  test('tests addresses correctly', () => {
    expect(
      validators.isEthereumAddress('0x07889A89C6854bb4Ec445825E680255b17751192')
    ).toBe(true);
    expect(
      validators.isEthereumAddress('0x07889A89C6854bb4Ec445825E680255b17751193')
    ).toBe(false);
  });
  test('tests isNotEmpty correctly', () => {
    expect(validators.isNotEmpty('')).toBe(false);
    expect(validators.isNotEmpty('test')).toBe(true);
    expect(validators.isNotEmpty(null)).toBe(false);
  });
  test('tests dates correctly', () => {
    expect(validators.isDate('1/1/2019')).toBe(true);
    expect(validators.isDate('22/22/2019')).toBe(false);
  });
});
