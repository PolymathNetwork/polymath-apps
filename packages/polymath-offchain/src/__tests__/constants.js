import { cleanEnvironment } from '../constants.js';

const ORIGINAL_ENV = process.env;

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

describe('Function: cleanEnvironment', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  test('throws error when an env var is missing', () => {
    const varList = ['SOME_ENV_VAR'];
    const expectedError = 'Missing env variable SOME_ENV_VAR';
    // using process.env
    expect(() => cleanEnvironment(undefined, varList)).toThrow(expectedError);

    // using custom env
    expect(() => cleanEnvironment({ OTHER_ENV_VAR: '1' }, varList)).toThrow(
      expectedError
    );
  });
});

describe('Constants', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  test('throws error when no network URL has been set', () => {
    process.env.WEB3_NETWORK_LOCAL_WS = undefined;
    process.env.WEB3_NETWORK_KOVAN_WS = undefined;
    process.env.WEB3_NETWORK_MAINNET_WS = undefined;
    expect(() => require('../constants.js')).toThrowError();
  });
});
