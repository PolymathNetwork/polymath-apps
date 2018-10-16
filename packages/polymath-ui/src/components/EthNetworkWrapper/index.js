// @flow

import EthNetworkWrapper from './EthNetworkWrapper';

export { default as reducer } from './reducer';
export {
  CONNECTED,
  ERROR_LOCKED,
  ERROR_NETWORK,
  ERROR_NOT_INSTALLED,
  ERROR_DISCONNECTED,
  ERROR_ACCESS_REQUESTED,
} from './actions';
export {
  NETWORK_MAIN,
  NETWORK_KOVAN,
  NETWORK_RINKEBY,
  NETWORK_ROPSTEN,
} from './networks';

export type { NetworkState } from './reducer';
export type { NetworkParams } from './actions';

export default EthNetworkWrapper;
