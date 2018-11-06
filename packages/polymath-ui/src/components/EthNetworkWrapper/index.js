// @flow

import EthNetworkWrapper from './EthNetworkWrapper';

export { default as reducer } from './reducer';

export const ERROR_NOT_INSTALLED = 1;
export const ERROR_LOCKED = 2;
export const ERROR_NETWORK = 3;
export const ERROR_DISCONNECTED = 4;
export const ERROR_ACCESS_REQUESTED = 5;

export {
  NETWORK_MAIN,
  NETWORK_KOVAN,
  NETWORK_RINKEBY,
  NETWORK_ROPSTEN,
} from './networks';

export default EthNetworkWrapper;

export type { NetworkState } from './reducer';
export type { NetworkParams } from './actions';
