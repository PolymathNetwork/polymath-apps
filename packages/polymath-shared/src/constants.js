// @flow

import PolyTokenFaucetArtifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/PolyTokenFaucet.json';

export const KOVAN_NETWORK_ID = '42';
export const GOERLI_NETWORK_ID = '5';
export const MAINNET_NETWORK_ID = '1';
export const LOCAL_NETWORK_ID = '15';
export const LOCALVM_NETWORK_ID = '16';
export const ROPSTEN_NETWORK_ID = '3';
export const RINKEBY_NETWORK_ID = '4';
export const ALLOW_GANACHE_ONLY =
  process.env.REACT_APP_ALLOW_GANACHE_ONLY === 'true';

type DaiAddresses = {
  [networkId: string]: string,
};

/**
 * NOTE @monitz87: uses a second deployed PolyTokenFaucet as DAI for local networks
 * (they are compatible as they are both ERC20 tokens)
 */
const faucetAddress =
  PolyTokenFaucetArtifact.networks[LOCAL_NETWORK_ID].address;
export const DAI_ADDRESSES: DaiAddresses = {
  [MAINNET_NETWORK_ID]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  [KOVAN_NETWORK_ID]: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
  [GOERLI_NETWORK_ID]: faucetAddress,
  [LOCAL_NETWORK_ID]: faucetAddress,
  [LOCALVM_NETWORK_ID]: faucetAddress,
};

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

export const MAX_SAFE_NUMBER = 99999999999999;
export const MIN_SAFE_NUMBER = -99999999999999;

export const EtherscanSubdomains = {
  [KOVAN_NETWORK_ID]: 'kovan',
  [GOERLI_NETWORK_ID]: 'goerli',
  [LOCAL_NETWORK_ID]: 'localhost',
};
