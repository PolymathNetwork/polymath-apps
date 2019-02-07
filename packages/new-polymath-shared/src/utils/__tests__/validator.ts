import { Validator, createValidator } from '../validator';

describe('Validator', () => {
  const validator: Validator = createValidator();
  test('initializes correctly', () => {
    expect(validator).toBeInstanceOf(Validator);
  });
  test('tests strings correctly', () => {
    expect(validator.validate('hi there', ['isString'])).toBe(true);
    expect(validator.validate(1, ['isString'])).toBe(false);
  });
  test('tests numbers correctly', () => {
    expect(validator.validate('hi there', ['isInt'])).toBe(false);
    expect(validator.validate(12, ['isInt'])).toBe(true);
  });
  test('tests addresses correctly', () => {
    expect(
      validator.validate('0x07889A89C6854bb4Ec445825E680255b17751192', [
        'isAddress',
      ])
    ).toBe(true);
    expect(
      validator.validate('0x07889A89C6854bb4Ec445825E680255b17751193', [
        'isAddress',
      ])
    ).toBe(false);
  });
  test('tests isNotEmpty correctly', () => {
    expect(validator.validate('', ['isNotEmpty'])).toBe(false);
    expect(validator.validate('test', ['isNotEmpty'])).toBe(true);
    expect(validator.validate(null, ['isNotEmpty'])).toBe(false);
  });
  test('tests dates correctly', () => {
    expect(validator.validate('1/1/2019', ['isDate'])).toBe(true);
    expect(validator.validate('22/22/2019', ['isDate'])).toBe(false);
  });
});
