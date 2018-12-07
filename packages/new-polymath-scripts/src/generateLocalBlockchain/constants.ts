import path from 'path';

const PACKAGE_ROOT_DIR = path.resolve(__dirname, '../../');
const TEMP_DIR = path.resolve(PACKAGE_ROOT_DIR, './temp');
const TEMP_BLOCKCHAIN_STATE_DIR = path.resolve(TEMP_DIR, './blockchain-state');
const BLOCKCHAIN_GAS_LIMIT = 90000000;
const BLOCKCHAIN_NETWORK_ID = 15;
const BLOCKCHAIN_MNEMONIC =
  'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat';
const WALLET_ADDRESSES = [
  '0x627306090abab3a6e1400e9345bc60c78a8bef57',
  '0xf17f52151ebef6c7334fad080c5704d77216b732',
  '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef',
  '0x821aea9a577a9b44299b9c15c88cf3087f3b5544',
  '0x0d1d4e623d10f9fba5db95830f7d3839406c6af2',
  '0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e',
  '0x2191ef87e392377ec08e7c08eb105ef5448eced5',
  '0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5',
  '0x6330a553fc93768f612722bb8c2ec78ac90b3bbc',
  '0x5aeda56215b167893e80b4fe645ba6d5bab767de',
];
const BLOCKCHAIN_URL = 'http://localhost:8545';
const DAI_AMOUNT = '1000000';
const LOCAL_PRIVATE_KEY =
  '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3';
const GAS_PRICE = 50000000000;
const INITIAL_ETHER = 1000000;

export {
  PACKAGE_ROOT_DIR,
  TEMP_DIR,
  TEMP_BLOCKCHAIN_STATE_DIR,
  BLOCKCHAIN_GAS_LIMIT,
  BLOCKCHAIN_NETWORK_ID,
  BLOCKCHAIN_MNEMONIC,
  BLOCKCHAIN_URL,
  LOCAL_PRIVATE_KEY,
  DAI_AMOUNT,
  GAS_PRICE,
  INITIAL_ETHER,
  WALLET_ADDRESSES,
};
