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

  test('throws error when no local network URL has been set for local stage', () => {
    process.env.DEPLOYMENT_STAGE = 'local';
    process.env.WEB3_NETWORK_LOCAL_WS = undefined;
    expect(() => require('../constants.js')).toThrowError();
  });

  test('throws error when no local PolymathRegistry address has been set for local stage', () => {
    process.env.DEPLOYMENT_STAGE = 'local';
    process.env.WEB3_NETWORK_LOCAL_WS = 'ws://some.url';
    process.env.POLYMATH_REGISTRY_ADDRESS_LOCAL = undefined;
    expect(() => require('../constants.js')).toThrowError();
  });

  test('throws error when no kovan network URL has been set for staging stage', () => {
    process.env.DEPLOYMENT_STAGE = 'staging';
    process.env.WEB3_NETWORK_KOVAN_WS = undefined;
    expect(() => require('../constants.js')).toThrowError();
  });

  test('throws error when no kovan PolymathRegistry address has been set for staging stage', () => {
    process.env.DEPLOYMENT_STAGE = 'staging';
    process.env.WEB3_NETWORK_KOVAN_WS = 'ws://some.url';
    process.env.POLYMATH_REGISTRY_ADDRESS_KOVAN = undefined;
    expect(() => require('../constants.js')).toThrowError();
  });

  test('throws error when no kovan network URL has been set for production stage', () => {
    process.env.DEPLOYMENT_STAGE = 'production';
    process.env.WEB3_NETWORK_KOVAN_WS = undefined;
    process.env.WEB3_NETWORK_MAINNET_WS = 'ws://some.url';
    expect(() => require('../constants.js')).toThrowError();
  });

  test('throws error when no kovan PolymathRegistry address has been set for production stage', () => {
    process.env.DEPLOYMENT_STAGE = 'production';
    process.env.WEB3_NETWORK_KOVAN_WS = 'ws://some.url';
    process.env.WEB3_NETWORK_MAINNET_WS = 'ws://some.url';
    process.env.POLYMATH_REGISTRY_ADDRESS_KOVAN = undefined;
    process.env.POLYMATH_REGISTRY_ADDRESS_MAINNET = '0x0';
    expect(() => require('../constants.js')).toThrowError();
  });

  test('throws error when no mainnet network URL has been set for production stage', () => {
    process.env.DEPLOYMENT_STAGE = 'production';
    process.env.WEB3_NETWORK_KOVAN_WS = 'ws://some.url';
    process.env.WEB3_NETWORK_MAINNET_WS = undefined;
    process.env.POLYMATH_REGISTRY_ADDRESS_KOVAN = '0x0';
    expect(() => require('../constants.js')).toThrowError();
  });

  test('throws error when no mainnet PolymathRegistry address has been set for production stage', () => {
    process.env.DEPLOYMENT_STAGE = 'production';
    process.env.WEB3_NETWORK_KOVAN_WS = 'ws://some.url';
    process.env.WEB3_NETWORK_MAINNET_WS = 'ws://some.url';
    process.env.POLYMATH_REGISTRY_ADDRESS_KOVAN = '0x0';
    process.env.POLYMATH_REGISTRY_ADDRESS_MAINNET = undefined;
    expect(() => require('../constants.js')).toThrowError();
  });

  const expectedLocalUrl = 'ws://some.local.url';
  const expectedKovanUrl = 'ws://some.kovan.url';
  const expectedMainnetUrl = 'ws://some.mainnet.url';
  const expectedPolymathRegistryAddressLocal = '0x0';
  const expectedPolymathRegistryAddressKovan = '0x1';
  const expectedPolymathRegistryAddressMainnet = '0x2';

  test('sets network params correctly when on local stage', () => {
    process.env.DEPLOYMENT_STAGE = 'local';
    process.env.WEB3_NETWORK_LOCAL_WS = expectedLocalUrl;
    process.env.WEB3_NETWORK_KOVAN_WS = expectedKovanUrl;
    process.env.WEB3_NETWORK_MAINNET_WS = expectedMainnetUrl;
    process.env.POLYMATH_REGISTRY_ADDRESS_LOCAL = expectedPolymathRegistryAddressLocal;
    process.env.POLYMATH_REGISTRY_ADDRESS_KOVAN = expectedPolymathRegistryAddressKovan;
    process.env.POLYMATH_REGISTRY_ADDRESS_MAINNET = expectedPolymathRegistryAddressMainnet;

    const { NETWORKS } = require('../constants.js');

    expect(NETWORKS).toEqual({
      '15': {
        name: 'local',
        url: expectedLocalUrl,
        polymathRegistryAddress: expectedPolymathRegistryAddressLocal,
      },
    });
  });

  test('sets network params correctly when on staging stage if no local network is specified', () => {
    process.env.DEPLOYMENT_STAGE = 'staging';
    process.env.WEB3_NETWORK_LOCAL_WS = '';
    process.env.WEB3_NETWORK_KOVAN_WS = expectedKovanUrl;
    process.env.WEB3_NETWORK_MAINNET_WS = expectedMainnetUrl;
    process.env.POLYMATH_REGISTRY_ADDRESS_LOCAL = '';
    process.env.POLYMATH_REGISTRY_ADDRESS_KOVAN = expectedPolymathRegistryAddressKovan;
    process.env.POLYMATH_REGISTRY_ADDRESS_MAINNET = expectedPolymathRegistryAddressMainnet;

    const { NETWORKS } = require('../constants.js');

    expect(NETWORKS).toEqual({
      '42': {
        name: 'kovan',
        url: expectedKovanUrl,
        polymathRegistryAddress: expectedPolymathRegistryAddressKovan,
      },
    });
  });

  test('sets network params correctly when on staging stage if a local network is specified', () => {
    process.env.DEPLOYMENT_STAGE = 'staging';
    process.env.WEB3_NETWORK_LOCAL_WS = expectedLocalUrl;
    process.env.WEB3_NETWORK_KOVAN_WS = expectedKovanUrl;
    process.env.WEB3_NETWORK_MAINNET_WS = expectedMainnetUrl;
    process.env.POLYMATH_REGISTRY_ADDRESS_LOCAL = expectedPolymathRegistryAddressLocal;
    process.env.POLYMATH_REGISTRY_ADDRESS_KOVAN = expectedPolymathRegistryAddressKovan;
    process.env.POLYMATH_REGISTRY_ADDRESS_MAINNET = expectedPolymathRegistryAddressMainnet;

    const { NETWORKS } = require('../constants.js');

    expect(NETWORKS).toEqual({
      '15': {
        name: 'local',
        url: expectedLocalUrl,
        polymathRegistryAddress: expectedPolymathRegistryAddressLocal,
      },
      '42': {
        name: 'kovan',
        url: expectedKovanUrl,
        polymathRegistryAddress: expectedPolymathRegistryAddressKovan,
      },
    });
  });

  test('sets network params correctly when on production stage', () => {
    process.env.DEPLOYMENT_STAGE = 'production';
    process.env.WEB3_NETWORK_LOCAL_WS = expectedLocalUrl;
    process.env.WEB3_NETWORK_KOVAN_WS = expectedKovanUrl;
    process.env.WEB3_NETWORK_MAINNET_WS = expectedMainnetUrl;
    process.env.POLYMATH_REGISTRY_ADDRESS_LOCAL = expectedPolymathRegistryAddressLocal;
    process.env.POLYMATH_REGISTRY_ADDRESS_KOVAN = expectedPolymathRegistryAddressKovan;
    process.env.POLYMATH_REGISTRY_ADDRESS_MAINNET = expectedPolymathRegistryAddressMainnet;

    const { NETWORKS } = require('../constants.js');

    expect(NETWORKS).toEqual({
      '42': {
        name: 'kovan',
        url: expectedKovanUrl,
        polymathRegistryAddress: expectedPolymathRegistryAddressKovan,
      },
      '1': {
        name: 'mainnet',
        url: expectedMainnetUrl,
        polymathRegistryAddress: expectedPolymathRegistryAddressMainnet,
      },
    });
  });
});
