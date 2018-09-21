// @flow

const cleanEnvironment = <T: { [string]: string }>(
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
  WEB3_NETWORK: string,
  MONGODB_URL: string,
  PORT: string,
  SENDGRID_API_KEY: string,
|};

const env = cleanEnvironment<Environment>(process.env, [
  'WEB3_NETWORK',
  'MONGODB_URL',
  'PORT',
  // 'SENDGRID_API_KEY',
]);

export const MONGODB_URL = env.MONGODB_URL;
export const WEB3_NETWORK = env.WEB3_NETWORK;
export const PORT = parseInt(env.PORT, 10);
export const SENDGRID_API_KEY = env.SENDGRID_API_KEY;
