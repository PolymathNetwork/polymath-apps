// @flow

const cleanEnvironment = <T: { [string]: any }>(
  env: {} = process.env,
  expectedVars: Array<string>
): T => {
  if (!env) {
    throw new Error();
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
  NODE_ENV: 'LOCAL' | 'STAGING' | 'PRODUCTION',
  MONGODB_URL: string,
  PORT: string,
  SENDGRID_API_KEY: string,
|};

const NETWORKS = {
  LOCAL: {
    id: '15',
    url: 'http://localhost:8545',
  },
  PRODUCTION: {
    // Main
    id: '1',
    url: 'https://mainnet.infura.io/C1yXP10CIm9kzJyTfUMO',
  },
  STAGING: {
    // Kovan
    id: '42',
    url:
      'https://heartily-internal-escargot.quiknode.io/46df7525-5518-428e-b30b-9dea09480213/4oM662IRx_2tZJq3ht4wdQ==/',
  },
};

const env = cleanEnvironment<Environment>(process.env, [
  'NODE_ENV',
  'MONGODB_URL',
  'PORT',
  // 'SENDGRID_API_KEY',
]);

export const MONGODB_URL = env.MONGODB_URL;
export const NODE_ENV = env.NODE_ENV;
export const WEB3_NETWORK = NETWORKS[env.NODE_ENV];
export const PORT = parseInt(env.PORT, 10);
export const SENDGRID_API_KEY = env.SENDGRID_API_KEY;
export const TYPED_NAME = 'Verification code from the Polymath server';
