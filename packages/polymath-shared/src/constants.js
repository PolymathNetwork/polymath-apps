// @flow

export const KOVAN_NETWORK_ID = '42';
export const MAINNET_NETWORK_ID = '1';
export const LOCAL_NETWORK_ID = '15';
export const LOCALVM_NETWORK_ID = '16';
export const ROPSTEN_NETWORK_ID = '3';
export const RINKEBY_NETWORK_ID = '4';

type DaiAddresses = {
  [networkId: string]: string,
};
// NOTE @RafaelVidaurre: Uses the DAI's kovan address for local network for
// simplicity
export const DAI_ADDRESSES: DaiAddresses = {
  [MAINNET_NETWORK_ID]: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
  [KOVAN_NETWORK_ID]: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
  [LOCAL_NETWORK_ID]: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
  [LOCALVM_NETWORK_ID]: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
};

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';
