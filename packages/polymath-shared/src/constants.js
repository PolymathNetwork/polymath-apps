// @flow

import PolyTokenFaucetArtifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/PolyTokenFaucet.json';

export const KOVAN_NETWORK_ID = '42';
export const MAINNET_NETWORK_ID = '1';
export const LOCAL_NETWORK_ID = '15';
export const LOCALVM_NETWORK_ID = '16';
export const ROPSTEN_NETWORK_ID = '3';
export const RINKEBY_NETWORK_ID = '4';

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
  [MAINNET_NETWORK_ID]: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
  [KOVAN_NETWORK_ID]: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
  [LOCAL_NETWORK_ID]: faucetAddress,
  [LOCALVM_NETWORK_ID]: faucetAddress,
};

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

export const MAX_SAFE_NUMBER = 99999999999999;
export const MIN_SAFE_NUMBER = -99999999999999;
