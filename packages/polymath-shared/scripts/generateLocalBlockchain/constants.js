const path = require('path');

const PACKAGE_ROOT_DIR = path.resolve(__dirname, '../../');
const TEMP_DIR = path.resolve(PACKAGE_ROOT_DIR, './temp');
const TEMP_BLOCKCHAIN_STATE_DIR = path.resolve(TEMP_DIR, './blockchain-state');
const BLOCKCHAIN_GAS_LIMIT = 90000000;
const BLOCKCHAIN_NETWORK_ID = 15;
const BLOCKCHAIN_MNEMONIC =
  'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat';

module.exports = {
  PACKAGE_ROOT_DIR,
  TEMP_DIR,
  TEMP_BLOCKCHAIN_STATE_DIR,
  BLOCKCHAIN_GAS_LIMIT,
  BLOCKCHAIN_NETWORK_ID,
  BLOCKCHAIN_MNEMONIC,
};
