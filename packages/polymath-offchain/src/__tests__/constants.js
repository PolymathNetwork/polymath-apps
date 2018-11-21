import { cleanEnvironment } from '../constants.js';
import {
  LOCAL_NETWORK_ID,
  LOCALVM_NETWORK_ID,
  KOVAN_NETWORK_ID,
  MAINNET_NETWORK_ID,
} from '@polymathnetwork/shared/constants';

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
    process.env = {
      ...ORIGINAL_ENV,
      WEB3_NETWORK_LOCAL_WS: 'ws://some.local.url',
      WEB3_NETWORK_LOCALVM_WS: 'ws://some.localVM.url',
      WEB3_NETWORK_KOVAN_WS: 'ws//some.kovan.url',
      WEB3_NETWORK_MAINNET_WS: 'ws//some.mainnet.url',
      POLYMATH_REGISTRY_ADDRESS_LOCAL: '0x0',
      POLYMATH_REGISTRY_ADDRESS_KOVAN: '0x1',
      POLYMATH_REGISTRY_ADDRESS_MAINNET: '0x2',
    };
  });

  test('throws error if both localVM and local network URLs are set', () => {
    expect(() => require('../constants.js')).toThrow(
      'Only one of WEB3_NETWORK_LOCAL_WS or WEB3_NETWORK_LOCALVM_WS must be set, not both'
    );
  });

  test('throws error when neither local or localVM network URLs have been set for local stage', () => {
    process.env.DEPLOYMENT_STAGE = 'local';
    process.env.WEB3_NETWORK_LOCAL_WS = undefined;
    process.env.WEB3_NETWORK_LOCALVM_WS = undefined;
    expect(() => require('../constants.js')).toThrow(
      'Missing env variables: at least one of WEB3_NETWORK_LOCAL_WS or WEB3_NETWORK_LOCALVM_WS must be set'
    );
  });

  test('throws error when no local PolymathRegistry address has been set for local stage', () => {
    process.env.DEPLOYMENT_STAGE = 'local';
    process.env.WEB3_NETWORK_LOCALVM_WS = undefined;
    process.env.POLYMATH_REGISTRY_ADDRESS_LOCAL = undefined;
    expect(() => require('../constants.js')).toThrow(
      'Missing env variable POLYMATH_REGISTRY_ADDRESS_LOCAL'
    );
  });

  test('throws error when no kovan network URL has been set for staging stage', () => {
    process.env.DEPLOYMENT_STAGE = 'staging';
    process.env.WEB3_NETWORK_LOCALVM_WS = undefined;
    process.env.WEB3_NETWORK_KOVAN_WS = undefined;
    expect(() => require('../constants.js')).toThrow(
      'Missing env variable WEB3_NETWORK_KOVAN_WS'
    );
  });

  test('throws error when no kovan PolymathRegistry address has been set for staging stage', () => {
    process.env.DEPLOYMENT_STAGE = 'staging';
    process.env.WEB3_NETWORK_LOCALVM_WS = undefined;
    process.env.POLYMATH_REGISTRY_ADDRESS_KOVAN = undefined;
    expect(() => require('../constants.js')).toThrow(
      'Missing env variable POLYMATH_REGISTRY_ADDRESS_KOVAN'
    );
  });

  test('throws error when no kovan network URL has been set for production stage', () => {
    process.env.DEPLOYMENT_STAGE = 'production';
    process.env.WEB3_NETWORK_LOCALVM_WS = undefined;
    process.env.WEB3_NETWORK_KOVAN_WS = undefined;
    expect(() => require('../constants.js')).toThrow(
      'Missing env variable WEB3_NETWORK_KOVAN_WS'
    );
  });

  test('throws error when no kovan PolymathRegistry address has been set for production stage', () => {
    process.env.DEPLOYMENT_STAGE = 'production';
    process.env.WEB3_NETWORK_LOCALVM_WS = undefined;
    process.env.POLYMATH_REGISTRY_ADDRESS_KOVAN = undefined;
    expect(() => require('../constants.js')).toThrow(
      'Missing env variable POLYMATH_REGISTRY_ADDRESS_KOVAN'
    );
  });

  test('throws error when no mainnet network URL has been set for production stage', () => {
    process.env.DEPLOYMENT_STAGE = 'production';
    process.env.WEB3_NETWORK_LOCALVM_WS = undefined;
    process.env.WEB3_NETWORK_MAINNET_WS = undefined;
    expect(() => require('../constants.js')).toThrow(
      'Missing env variable WEB3_NETWORK_MAINNET_WS'
    );
  });

  test('throws error when no mainnet PolymathRegistry address has been set for production stage', () => {
    process.env.DEPLOYMENT_STAGE = 'production';
    process.env.WEB3_NETWORK_LOCALVM_WS = undefined;
    process.env.POLYMATH_REGISTRY_ADDRESS_MAINNET = undefined;
    expect(() => require('../constants.js')).toThrow(
      'Missing env variable POLYMATH_REGISTRY_ADDRESS_MAINNET'
    );
  });

  const criticalRetries = 5;
  const optionalRetries = 0;
  const expectedLocalName = 'local';
  const expectedLocalVMName = 'localVM';
  const expectedKovanName = 'kovan';
  const expectedMainnetName = 'mainnet';

  test('sets network params correctly when on local stage', () => {
    process.env.DEPLOYMENT_STAGE = 'local';
    process.env.WEB3_NETWORK_LOCALVM_WS = undefined;

    const { NETWORKS } = require('../constants');

    const {
      WEB3_NETWORK_LOCAL_WS,
      WEB3_NETWORK_KOVAN_WS,
      WEB3_NETWORK_MAINNET_WS,
      POLYMATH_REGISTRY_ADDRESS_LOCAL,
      POLYMATH_REGISTRY_ADDRESS_KOVAN,
      POLYMATH_REGISTRY_ADDRESS_MAINNET,
    } = process.env;

    expect(NETWORKS).toEqual({
      [LOCAL_NETWORK_ID]: {
        name: expectedLocalName,
        url: WEB3_NETWORK_LOCAL_WS,
        connect: true,
        optional: false,
        localNetwork: true,
        maxRetries: criticalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      },
      [LOCALVM_NETWORK_ID]: {
        name: expectedLocalVMName,
        url: '',
        connect: false,
        optional: true,
        localNetwork: true,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      },
      [KOVAN_NETWORK_ID]: {
        name: expectedKovanName,
        url: WEB3_NETWORK_KOVAN_WS,
        connect: false,
        optional: true,
        localNetwork: false,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_KOVAN,
      },
      [MAINNET_NETWORK_ID]: {
        name: expectedMainnetName,
        url: WEB3_NETWORK_MAINNET_WS,
        connect: false,
        optional: true,
        localNetwork: false,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_MAINNET,
      },
    });
  });

  test('sets network params correctly when on local stage if testing with VM', () => {
    process.env.DEPLOYMENT_STAGE = 'local';
    process.env.WEB3_NETWORK_LOCAL_WS = undefined;

    const { NETWORKS } = require('../constants');

    const {
      WEB3_NETWORK_LOCALVM_WS,
      WEB3_NETWORK_KOVAN_WS,
      WEB3_NETWORK_MAINNET_WS,
      POLYMATH_REGISTRY_ADDRESS_LOCAL,
      POLYMATH_REGISTRY_ADDRESS_KOVAN,
      POLYMATH_REGISTRY_ADDRESS_MAINNET,
    } = process.env;

    expect(NETWORKS).toEqual({
      [LOCAL_NETWORK_ID]: {
        name: expectedLocalName,
        url: '',
        connect: false,
        optional: true,
        localNetwork: true,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      },
      [LOCALVM_NETWORK_ID]: {
        name: expectedLocalVMName,
        url: WEB3_NETWORK_LOCALVM_WS,
        connect: true,
        optional: false,
        localNetwork: true,
        maxRetries: criticalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      },
      [KOVAN_NETWORK_ID]: {
        name: expectedKovanName,
        url: WEB3_NETWORK_KOVAN_WS,
        connect: false,
        optional: true,
        localNetwork: false,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_KOVAN,
      },
      [MAINNET_NETWORK_ID]: {
        name: expectedMainnetName,
        url: WEB3_NETWORK_MAINNET_WS,
        connect: false,
        optional: true,
        localNetwork: false,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_MAINNET,
      },
    });
  });

  test('sets network params correctly when on staging stage if no local network is specified', () => {
    process.env.DEPLOYMENT_STAGE = 'staging';
    process.env.WEB3_NETWORK_LOCAL_WS = undefined;
    process.env.WEB3_NETWORK_LOCALVM_WS = undefined;

    const { NETWORKS } = require('../constants');

    const {
      WEB3_NETWORK_KOVAN_WS,
      WEB3_NETWORK_MAINNET_WS,
      POLYMATH_REGISTRY_ADDRESS_LOCAL,
      POLYMATH_REGISTRY_ADDRESS_KOVAN,
      POLYMATH_REGISTRY_ADDRESS_MAINNET,
    } = process.env;

    expect(NETWORKS).toEqual({
      [LOCAL_NETWORK_ID]: {
        name: expectedLocalName,
        url: '',
        connect: false,
        optional: true,
        localNetwork: true,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      },
      [LOCALVM_NETWORK_ID]: {
        name: expectedLocalVMName,
        url: '',
        connect: false,
        optional: true,
        localNetwork: true,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      },
      [KOVAN_NETWORK_ID]: {
        name: expectedKovanName,
        url: WEB3_NETWORK_KOVAN_WS,
        connect: true,
        optional: false,
        localNetwork: false,
        maxRetries: criticalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_KOVAN,
      },
      [MAINNET_NETWORK_ID]: {
        name: expectedMainnetName,
        url: WEB3_NETWORK_MAINNET_WS,
        connect: false,
        optional: true,
        localNetwork: false,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_MAINNET,
      },
    });
  });

  test('sets network params correctly when on staging stage if a local network is specified', () => {
    process.env.DEPLOYMENT_STAGE = 'staging';
    process.env.WEB3_NETWORK_LOCALVM_WS = undefined;

    const { NETWORKS } = require('../constants');

    const {
      WEB3_NETWORK_LOCAL_WS,
      WEB3_NETWORK_KOVAN_WS,
      WEB3_NETWORK_MAINNET_WS,
      POLYMATH_REGISTRY_ADDRESS_LOCAL,
      POLYMATH_REGISTRY_ADDRESS_KOVAN,
      POLYMATH_REGISTRY_ADDRESS_MAINNET,
    } = process.env;

    expect(NETWORKS).toEqual({
      [LOCAL_NETWORK_ID]: {
        name: expectedLocalName,
        url: WEB3_NETWORK_LOCAL_WS,
        connect: true,
        optional: true,
        localNetwork: true,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      },
      [LOCALVM_NETWORK_ID]: {
        name: expectedLocalVMName,
        url: '',
        connect: false,
        optional: true,
        localNetwork: true,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      },
      [KOVAN_NETWORK_ID]: {
        name: expectedKovanName,
        url: WEB3_NETWORK_KOVAN_WS,
        connect: true,
        optional: false,
        localNetwork: false,
        maxRetries: criticalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_KOVAN,
      },
      [MAINNET_NETWORK_ID]: {
        name: expectedMainnetName,
        url: WEB3_NETWORK_MAINNET_WS,
        connect: false,
        optional: true,
        localNetwork: false,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_MAINNET,
      },
    });
  });

  test('sets network params correctly when on staging stage if a localVM network is specified', () => {
    process.env.DEPLOYMENT_STAGE = 'staging';
    process.env.WEB3_NETWORK_LOCAL_WS = undefined;

    const { NETWORKS } = require('../constants');

    const {
      WEB3_NETWORK_LOCALVM_WS,
      WEB3_NETWORK_KOVAN_WS,
      WEB3_NETWORK_MAINNET_WS,
      POLYMATH_REGISTRY_ADDRESS_LOCAL,
      POLYMATH_REGISTRY_ADDRESS_KOVAN,
      POLYMATH_REGISTRY_ADDRESS_MAINNET,
    } = process.env;

    expect(NETWORKS).toEqual({
      [LOCAL_NETWORK_ID]: {
        name: expectedLocalName,
        url: '',
        connect: false,
        optional: true,
        localNetwork: true,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      },
      [LOCALVM_NETWORK_ID]: {
        name: expectedLocalVMName,
        url: WEB3_NETWORK_LOCALVM_WS,
        connect: true,
        optional: true,
        localNetwork: true,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      },
      [KOVAN_NETWORK_ID]: {
        name: expectedKovanName,
        url: WEB3_NETWORK_KOVAN_WS,
        connect: true,
        optional: false,
        localNetwork: false,
        maxRetries: criticalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_KOVAN,
      },
      [MAINNET_NETWORK_ID]: {
        name: expectedMainnetName,
        url: WEB3_NETWORK_MAINNET_WS,
        connect: false,
        optional: true,
        localNetwork: false,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_MAINNET,
      },
    });
  });

  test('sets network params correctly when on production stage if no local network is specified', () => {
    process.env.DEPLOYMENT_STAGE = 'production';
    process.env.WEB3_NETWORK_LOCAL_WS = undefined;
    process.env.WEB3_NETWORK_LOCALVM_WS = undefined;

    const { NETWORKS } = require('../constants');

    const {
      WEB3_NETWORK_KOVAN_WS,
      WEB3_NETWORK_MAINNET_WS,
      POLYMATH_REGISTRY_ADDRESS_LOCAL,
      POLYMATH_REGISTRY_ADDRESS_KOVAN,
      POLYMATH_REGISTRY_ADDRESS_MAINNET,
    } = process.env;

    expect(NETWORKS).toEqual({
      [LOCAL_NETWORK_ID]: {
        name: expectedLocalName,
        url: '',
        connect: false,
        optional: true,
        localNetwork: true,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      },
      [LOCALVM_NETWORK_ID]: {
        name: expectedLocalVMName,
        url: '',
        connect: false,
        optional: true,
        localNetwork: true,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      },
      [KOVAN_NETWORK_ID]: {
        name: expectedKovanName,
        url: WEB3_NETWORK_KOVAN_WS,
        connect: true,
        optional: false,
        localNetwork: false,
        maxRetries: criticalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_KOVAN,
      },
      [MAINNET_NETWORK_ID]: {
        name: expectedMainnetName,
        url: WEB3_NETWORK_MAINNET_WS,
        connect: true,
        optional: false,
        localNetwork: false,
        maxRetries: criticalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_MAINNET,
      },
    });
  });

  test('sets network params correctly when on production stage if a local network is specified', () => {
    process.env.DEPLOYMENT_STAGE = 'production';
    process.env.WEB3_NETWORK_LOCALVM_WS = undefined;

    const { NETWORKS } = require('../constants');

    const {
      WEB3_NETWORK_LOCAL_WS,
      WEB3_NETWORK_KOVAN_WS,
      WEB3_NETWORK_MAINNET_WS,
      POLYMATH_REGISTRY_ADDRESS_LOCAL,
      POLYMATH_REGISTRY_ADDRESS_KOVAN,
      POLYMATH_REGISTRY_ADDRESS_MAINNET,
    } = process.env;

    expect(NETWORKS).toEqual({
      [LOCAL_NETWORK_ID]: {
        name: expectedLocalName,
        url: WEB3_NETWORK_LOCAL_WS,
        connect: true,
        optional: true,
        localNetwork: true,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      },
      [LOCALVM_NETWORK_ID]: {
        name: expectedLocalVMName,
        url: '',
        connect: false,
        optional: true,
        localNetwork: true,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      },
      [KOVAN_NETWORK_ID]: {
        name: expectedKovanName,
        url: WEB3_NETWORK_KOVAN_WS,
        connect: true,
        optional: false,
        localNetwork: false,
        maxRetries: criticalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_KOVAN,
      },
      [MAINNET_NETWORK_ID]: {
        name: expectedMainnetName,
        url: WEB3_NETWORK_MAINNET_WS,
        connect: true,
        optional: false,
        localNetwork: false,
        maxRetries: criticalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_MAINNET,
      },
    });
  });

  test('sets network params correctly when on production stage if a localVM network is specified', () => {
    process.env.DEPLOYMENT_STAGE = 'production';
    process.env.WEB3_NETWORK_LOCAL_WS = undefined;

    const { NETWORKS } = require('../constants');

    const {
      WEB3_NETWORK_LOCALVM_WS,
      WEB3_NETWORK_KOVAN_WS,
      WEB3_NETWORK_MAINNET_WS,
      POLYMATH_REGISTRY_ADDRESS_LOCAL,
      POLYMATH_REGISTRY_ADDRESS_KOVAN,
      POLYMATH_REGISTRY_ADDRESS_MAINNET,
    } = process.env;

    expect(NETWORKS).toEqual({
      [LOCAL_NETWORK_ID]: {
        name: expectedLocalName,
        url: '',
        connect: false,
        optional: true,
        localNetwork: true,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      },
      [LOCALVM_NETWORK_ID]: {
        name: expectedLocalVMName,
        url: WEB3_NETWORK_LOCALVM_WS,
        connect: true,
        optional: true,
        localNetwork: true,
        maxRetries: optionalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      },
      [KOVAN_NETWORK_ID]: {
        name: expectedKovanName,
        url: WEB3_NETWORK_KOVAN_WS,
        connect: true,
        optional: false,
        localNetwork: false,
        maxRetries: criticalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_KOVAN,
      },
      [MAINNET_NETWORK_ID]: {
        name: expectedMainnetName,
        url: WEB3_NETWORK_MAINNET_WS,
        connect: true,
        optional: false,
        localNetwork: false,
        maxRetries: criticalRetries,
        polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_MAINNET,
      },
    });
  });
});
