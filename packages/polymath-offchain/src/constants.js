// @flow

const cleanEnvironment = <T: { [string]: string }>(
  env = process.env,
  expectedVars: Array<string>
): T => {
  if (!env) {
    throw new Error(`No environment provided`);
  }
  expectedVars.forEach(name => {
    if (!env[name]) {
      throw new Error(`Missing env variable ${name}`);
    }
  });

  // TODO @monitz87: fix horrible type casting
  return ((env: any): T);
};

type Environment = {|
  WEB3_NETWORK_WS: string,
  WEB3_NETWORK_NAME: string,
  PORT: string,
  POLYMATH_OFFCHAIN_URL: string,
  POLYMATH_ISSUER_URL: string,
  NODE_ENV: string,
  MONGODB_URL: string,
  SENDGRID_API_KEY?: string,
|};

const env = cleanEnvironment<Environment>(process.env, [
  'WEB3_NETWORK_WS',
  'WEB3_NETWORK_NAME',
  'PORT',
  'POLYMATH_OFFCHAIN_URL',
  'POLYMATH_ISSUER_URL',
  'NODE_ENV',
  'MONGODB_URL',
  'SENDGRID_API_KEY',
]);

const validNetworkNames = ['LOCAL', 'KOVAN', 'MAINNET'];

const networkName = env.WEB3_NETWORK_NAME;

if (!validNetworkNames.find(name => name === networkName)) {
  throw new Error(
    `Invalid env variable WEB3_NETWORK_NAME, must be one of: ${validNetworkNames.join(
      ', '
    )}`
  );
}

export const MONGODB_URL = env.MONGODB_URL;
export const NODE_ENV = env.NODE_ENV;
export const WEB3_NETWORK_WS = env.WEB3_NETWORK_WS;
export const WEB3_NETWORK_NAME = networkName.toLowerCase();
export const PORT = parseInt(env.PORT, 10);
export const POLYMATH_ISSUER_URL = env.POLYMATH_ISSUER_URL;
export const POLYMATH_OFFCHAIN_URL = env.POLYMATH_OFFCHAIN_URL;
export const SENDGRID_API_KEY = env.SENDGRID_API_KEY;
export const TYPED_NAME = 'Verification code from the Polymath server';
export const STO_MODULE_TYPE = 3;
