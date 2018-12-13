const path = require('path');
const _ = require('lodash');
const dotenv = require('dotenv');
const dotenvSafe = require('dotenv-safe');

module.exports = () => {
  // Get client-only environment variables with .env file support
  // Prioritize real environment variables

  dotenv.config({ path: './.env.local' });

  // Get local environment variables
  // NOTE @RafaelVidaurre: We could prevent this in remove envs
  const { required: requiredVars, parsed } = dotenvSafe.config({
    path: path.resolve(__dirname, './.env.local'),
    example: path.resolve(__dirname, './.env.required.local'),
  });

  const allowedKeys = Object.keys(requiredVars);
  const envVars = _.pick(parsed, allowedKeys);

  return envVars;
};
