// @flow

import { normalizeURL } from '@polymathnetwork/shared/utils';

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
  WEB3_NETWORK_LOCAL_WS?: string,
  WEB3_NETWORK_KOVAN_WS?: string,
  WEB3_NETWORK_MAINNET_WS?: string,
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
  WEB3_NETWORK_LOCAL_WS,
  WEB3_NETWORK_KOVAN_WS,
  WEB3_NETWORK_MAINNET_WS,
} = env;

export const MONGODB_URI = env.MONGODB_URI;
export const NODE_ENV = env.NODE_ENV;
export const DEPLOYMENT_STAGE = env.DEPLOYMENT_STAGE;

const NETWORKS = {};

if (DEPLOYMENT_STAGE === 'production') {
  if (!WEB3_NETWORK_MAINNET_WS) {
    throw new Error(`Missing env variable WEB3_NETWORK_MAINNET_WS`);
  }
  NETWORKS['1'] = {
    name: 'mainnet',
    url: WEB3_NETWORK_MAINNET_WS,
  };
}

if (DEPLOYMENT_STAGE !== 'local') {
  if (!WEB3_NETWORK_KOVAN_WS) {
    throw new Error(`Missing env variable WEB3_NETWORK_KOVAN_WS`);
  }
  NETWORKS['42'] = {
    name: 'kovan',
    url: WEB3_NETWORK_KOVAN_WS,
  };
} else {
  if (!WEB3_NETWORK_LOCAL_WS) {
    throw new Error(`Missing env variable WEB3_NETWORK_LOCAL_WS`);
  }
  NETWORKS['15'] = {
    name: 'local',
    url: WEB3_NETWORK_LOCAL_WS,
  };
}

export { NETWORKS };
export const PORT = parseInt(env.PORT, 10);
export const POLYMATH_ISSUER_URL = normalizeURL(env.POLYMATH_ISSUER_URL);
export const POLYMATH_OFFCHAIN_URL = normalizeURL(env.POLYMATH_OFFCHAIN_URL);
export const SENDGRID_API_KEY = env.SENDGRID_API_KEY;
export const TYPED_NAME = 'Verification code from the Polymath server';
export const STO_MODULE_TYPE = 3;
