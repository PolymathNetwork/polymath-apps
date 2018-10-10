// @flow

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
  MONGODB_URL: string,
  SENDGRID_API_KEY?: string,
|};

const env = cleanEnvironment<Environment>(process.env, [
  'PORT',
  'POLYMATH_OFFCHAIN_URL',
  'POLYMATH_ISSUER_URL',
  'NODE_ENV',
  'DEPLOYMENT_STAGE',
  'MONGODB_URL',
]);

const {
  WEB3_NETWORK_LOCAL_WS,
  WEB3_NETWORK_KOVAN_WS,
  WEB3_NETWORK_MAINNET_WS,
} = env;

const networkUrls = [
  WEB3_NETWORK_LOCAL_WS,
  WEB3_NETWORK_KOVAN_WS,
  WEB3_NETWORK_MAINNET_WS,
];

// At least one of the network URLs must be defined
if (!networkUrls.some(url => !!url)) {
  throw new Error(
    `Missing network URL env variables. At least one network URL must be set`
  );
}

export const MONGODB_URL = env.MONGODB_URL;
export const NODE_ENV = env.NODE_ENV;
export const DEPLOYMENT_STAGE = env.DEPLOYMENT_STAGE;
export const NETWORKS = {
  '15': {
    name: 'local',
    url: WEB3_NETWORK_LOCAL_WS,
  },
  '42': {
    name: 'kovan',
    url: WEB3_NETWORK_KOVAN_WS,
  },
  '1': {
    name: 'mainnet',
    url: WEB3_NETWORK_MAINNET_WS,
  },
};
export const PORT = parseInt(env.PORT, 10);
export const POLYMATH_ISSUER_URL = env.POLYMATH_ISSUER_URL;
export const POLYMATH_OFFCHAIN_URL = env.POLYMATH_OFFCHAIN_URL;
export const SENDGRID_API_KEY = env.SENDGRID_API_KEY;
export const TYPED_NAME = 'Verification code from the Polymath server';
export const STO_MODULE_TYPE = 3;
