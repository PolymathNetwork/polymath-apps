// @flow

import { normalizeURL } from '@polymathnetwork/shared/utils';
import type { NetworkId } from '@polymathnetwork/shared/constants';

export const cleanEnvironment = <T: { [string]: string }>(
  env: any = process.env,
  expectedVars: Array<string>
): T => {
  expectedVars.forEach(name => {
    if (!env[name]) {
      throw new Error(`Missing env variable ${name}`);
    }
  });

  // TODO @monitz87: fix horrible type casting
  return ((env: any): T);
};

type Environment = {|
  WEB3_NETWORK_LOCALVM_WS?: string,
  WEB3_NETWORK_LOCAL_WS?: string,
  WEB3_NETWORK_KOVAN_WS?: string,
  WEB3_NETWORK_MAINNET_WS?: string,
  POLYMATH_REGISTRY_ADDRESS_LOCAL?: string,
  POLYMATH_REGISTRY_ADDRESS_KOVAN?: string,
  POLYMATH_REGISTRY_ADDRESS_MAINNET?: string,
  PORT: string,
  POLYMATH_OFFCHAIN_URL: string,
  POLYMATH_ISSUER_URL: string,
  NODE_ENV: string,
  DEPLOYMENT_STAGE: string,
  MONGODB_URI: string,
  SENDGRID_API_KEY?: string,
|};

const env = cleanEnvironment<Environment>(process.env, [
  'PORT',
  'POLYMATH_OFFCHAIN_URL',
  'POLYMATH_ISSUER_URL',
  'NODE_ENV',
  'DEPLOYMENT_STAGE',
  'MONGODB_URI',
]);

const {
  WEB3_NETWORK_LOCALVM_WS,
  WEB3_NETWORK_LOCAL_WS,
  WEB3_NETWORK_KOVAN_WS,
  WEB3_NETWORK_MAINNET_WS,
  POLYMATH_REGISTRY_ADDRESS_LOCAL,
  POLYMATH_REGISTRY_ADDRESS_KOVAN,
  POLYMATH_REGISTRY_ADDRESS_MAINNET,
} = env;

if (WEB3_NETWORK_LOCAL_WS && WEB3_NETWORK_LOCALVM_WS) {
  throw new Error(
    'Only one of WEB3_NETWORK_LOCAL_WS or WEB3_NETWORK_LOCALVM_WS must be set, not both'
  );
}

export const MONGODB_URI = env.MONGODB_URI;
export const NODE_ENV = env.NODE_ENV;
export const DEPLOYMENT_STAGE = env.DEPLOYMENT_STAGE;

export const LOCAL_NETWORK_ID: NetworkId = '15';
export const LOCALVM_NETWORK_ID: NetworkId = '16';
export const KOVAN_NETWORK_ID: NetworkId = '42';
export const MAINNET_NETWORK_ID: NetworkId = '1';

const CRITICAL_RETRIES = 5; // Amount of retries for mandatory connections
const OPTIONAL_RETRIES = 0; // Amount of retries for optional (testing) connections

/**
  Blockchain network params

  @member {string} name
  @member {string} url
  @member {boolean} connect if offchain should listen to this network (depends on the deployment stage)
  @member {boolean} optional if this network is not critical (i.e. local blockchain on staging)
  @member {number} maxRetries number of connection retries before giving up (if the network is optional, a warning is logged; if not, an error is thrown)
  @member {boolean} localNetwork if the network is a local blockchain
 */
export type NetworkOptions = {|
  name: string,
  url: string,
  connect: boolean,
  optional: boolean,
  maxRetries: number,
  localNetwork: boolean,
  polymathRegistryAddress: string,
|};

export const NETWORKS: {
  [id: string]: NetworkOptions,
} = {
  [LOCAL_NETWORK_ID]: {
    name: 'local',
    url: WEB3_NETWORK_LOCAL_WS || '',
    connect: false,
    optional: true,
    maxRetries: OPTIONAL_RETRIES,
    localNetwork: true,
    polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL || '',
  },
  [LOCALVM_NETWORK_ID]: {
    name: 'localVM',
    url: WEB3_NETWORK_LOCALVM_WS || '',
    connect: false,
    optional: true,
    maxRetries: OPTIONAL_RETRIES,
    localNetwork: true,
    polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL || '',
  },
  [KOVAN_NETWORK_ID]: {
    name: 'kovan',
    url: WEB3_NETWORK_KOVAN_WS || '',
    connect: false,
    optional: true,
    maxRetries: OPTIONAL_RETRIES,
    localNetwork: false,
    polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_KOVAN || '',
  },
  [MAINNET_NETWORK_ID]: {
    name: 'mainnet',
    url: WEB3_NETWORK_MAINNET_WS || '',
    connect: false,
    optional: true,
    maxRetries: OPTIONAL_RETRIES,
    localNetwork: false,
    polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_MAINNET || '',
  },
};

/**
 * - Production offchain MUST listen to Mainnet and Kovan
 * - Staging offchain MUST listen to kovan and can optionally listen to
 *   the local blockchain
 * - Local offchain MUST listen to either the local blockchain or the
 *   localVM blockchain
 */
if (DEPLOYMENT_STAGE !== 'local') {
  if (!WEB3_NETWORK_KOVAN_WS) {
    throw new Error('Missing env variable WEB3_NETWORK_KOVAN_WS');
  }
  if (!POLYMATH_REGISTRY_ADDRESS_KOVAN) {
    throw new Error('Missing env variable POLYMATH_REGISTRY_ADDRESS_KOVAN');
  }

  NETWORKS[KOVAN_NETWORK_ID].connect = true;
  NETWORKS[KOVAN_NETWORK_ID].optional = false;
  NETWORKS[KOVAN_NETWORK_ID].maxRetries = CRITICAL_RETRIES;

  if (DEPLOYMENT_STAGE === 'production') {
    if (!WEB3_NETWORK_MAINNET_WS) {
      throw new Error('Missing env variable WEB3_NETWORK_MAINNET_WS');
    }
    if (!POLYMATH_REGISTRY_ADDRESS_MAINNET) {
      throw new Error('Missing env variable POLYMATH_REGISTRY_ADDRESS_MAINNET');
    }

    NETWORKS[MAINNET_NETWORK_ID].connect = true;
    NETWORKS[MAINNET_NETWORK_ID].optional = false;
    NETWORKS[MAINNET_NETWORK_ID].maxRetries = CRITICAL_RETRIES;
  } else {
    if (WEB3_NETWORK_LOCAL_WS && POLYMATH_REGISTRY_ADDRESS_LOCAL) {
      NETWORKS[LOCAL_NETWORK_ID].connect = true;
      NETWORKS[LOCAL_NETWORK_ID].optional = true;
      NETWORKS[LOCAL_NETWORK_ID].maxRetries = OPTIONAL_RETRIES;
    }

    if (WEB3_NETWORK_LOCALVM_WS && POLYMATH_REGISTRY_ADDRESS_LOCAL) {
      NETWORKS[LOCALVM_NETWORK_ID].connect = true;
      NETWORKS[LOCALVM_NETWORK_ID].optional = true;
      NETWORKS[LOCALVM_NETWORK_ID].maxRetries = OPTIONAL_RETRIES;
    }
  }
} else {
  if (!WEB3_NETWORK_LOCAL_WS && !WEB3_NETWORK_LOCALVM_WS) {
    throw new Error(
      'Missing env variables: at least one of WEB3_NETWORK_LOCAL_WS or WEB3_NETWORK_LOCALVM_WS must be set'
    );
  }
  if (!POLYMATH_REGISTRY_ADDRESS_LOCAL) {
    throw new Error('Missing env variable POLYMATH_REGISTRY_ADDRESS_LOCAL');
  }

  if (WEB3_NETWORK_LOCAL_WS) {
    NETWORKS[LOCAL_NETWORK_ID].connect = true;
    NETWORKS[LOCAL_NETWORK_ID].optional = false;
    NETWORKS[LOCAL_NETWORK_ID].maxRetries = CRITICAL_RETRIES;
  } else {
    NETWORKS[LOCALVM_NETWORK_ID].connect = true;
    NETWORKS[LOCALVM_NETWORK_ID].optional = false;
    NETWORKS[LOCALVM_NETWORK_ID].maxRetries = CRITICAL_RETRIES;
  }
}

export const PORT = parseInt(env.PORT, 10);
export const POLYMATH_ISSUER_URL = normalizeURL(env.POLYMATH_ISSUER_URL);
export const POLYMATH_OFFCHAIN_URL = normalizeURL(env.POLYMATH_OFFCHAIN_URL);
export const SENDGRID_API_KEY = env.SENDGRID_API_KEY;
export const TYPED_NAME = 'Verification code from the Polymath server';
export const STO_MODULE_TYPE = 3;
