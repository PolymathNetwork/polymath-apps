// @flow

import EthNetworkWrapper from './EthNetworkWrapper';

export { default as reducer } from './reducer';
export {
  CONNECTED,
  ERROR_LOCKED,
  ERROR_NETWORK,
  ERROR_NOT_INSTALLED,
  ERROR_DISCONNECTED,
} from './actions';

export type { NetworkState } from './reducer';
export type { NetworkParams } from './actions';

export default EthNetworkWrapper;
