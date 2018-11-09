// @flow

/**
 * See documentation: https://github.com/PolymathNetwork/polymath-apps/wiki/Package:-Polymath-UI#actions
 */

import Web3 from 'web3';

import { getNetworkInfos, NETWORK_LOCAL, NETWORK_LOCALVM } from './networks';
import {
  ERROR_LOCKED,
  ERROR_NETWORK,
  ERROR_NOT_INSTALLED,
  ERROR_DISCONNECTED,
  ERROR_ACCESS_REQUESTED,
} from './';

import type { ExtractReturn } from './helpers';

export const CONNECTED = 'polymath-auth/CONNECTED';
export const FAILED = 'polymath-auth/FAILED';

export type NetworkParams = {|
  id: number,
  name: string,
  account: string,
  web3: Web3,
  web3WS: Web3,
|};

// Request accounts access, will make Metamask pop up
// FIXME @RafaelVidaurre: We shouldn't need to reload the browser after doing
// this. This should work differently after we refactor the state management
export const requestAuthorization = () => async (dispatch: Function) => {
  try {
    // We don't need to dispatch a success action because page will be reloaded by polling
    await window.ethereum.enable();
    window.location.reload();
  } catch (e) {
    // User denied access
    // eslint-disable-next-line
    // NOTE @Grsmto: commented because UI doesn't support this state
    // return dispatch(fail(ERROR_ACCESS_DENIED);
  }
};

const connected = (params: NetworkParams) => ({ type: CONNECTED, params });

const fail = (error: number) => ({ type: FAILED, error });

export const init = (networks: Array<string>) => async (dispatch: Function) => {
  let web3;
  let web3WS; // since MetaMask doesn't support WebSockets we need this extra client for events subscribing
  let networkId;

  const newProviderInjected = !!window.ethereum;
  const oldProviderInjected = !!window.web3;

  // Instantiate Web3 HTTP
  if (newProviderInjected) {
    web3 = new Web3(window.ethereum);
  } else if (oldProviderInjected) {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    // If no Metamask/Mist
    return dispatch(fail(ERROR_NOT_INSTALLED));
  }

  // Get current Metamask/Mist network id
  networkId = await web3.eth.net.getId();

  const isLocalhost =
    String(networkId) === NETWORK_LOCAL ||
    String(networkId) === NETWORK_LOCALVM ||
    networkId === undefined;
  const network = getNetworkInfos(!isLocalhost ? networkId : undefined);
  const accounts = await web3.eth.getAccounts();

  // Instantiate Web3 Web Socket
  web3WS = new Web3(process.env.REACT_APP_NODE_WS || network.url);

  if (!networkId) {
    web3.setProvider(web3WS.currentProvider);
    networkId = await web3.eth.net.getId();
  }

  // Listen for Metamask/Mist changes
  // TODO: @grsmto: Refactor this before it should not be here: actions should be pure.
  // https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#ear-listening-for-selected-account-changes
  setInterval(() => {
    // On account change
    web3.eth.getAccounts().then(_accounts => {
      if (_accounts[0] !== accounts[0]) {
        window.location.reload();
      }
    });

    // On network change
    web3.eth.net.getId().then(_id => {
      if (networkId !== _id) {
        window.location.reload();
      }
    });
  }, 1000);

  // TODO @bshevchenko: https://github.com/INFURA/infura/issues/80 hack below
  web3WS.eth.subscribe('newBlockHeaders', error => {
    if (error) {
      // eslint-disable-next-line
      console.error('web3WS newBlockHeaders', error);
      dispatch(fail(ERROR_DISCONNECTED));
    }
  });

  // Check if dapp is authorized by Metamask/Mist
  if (newProviderInjected && window.ethereum._metamask.isApproved) {
    const isMetamaskApproved = await window.ethereum._metamask.isApproved();

    if (!isMetamaskApproved) {
      dispatch(requestAuthorization());
      return dispatch(fail(ERROR_ACCESS_REQUESTED));
    }
  }

  if (!accounts.length) {
    return dispatch(fail(ERROR_LOCKED));
  }

  // If Metamask/Mist network is not supported
  if (
    network === undefined ||
    (!isLocalhost && !networks.includes(String(networkId)))
  ) {
    return dispatch(fail(ERROR_NETWORK));
  }

  // TODO @grsmto: Do proper dependency injection instead of sharing web3 instance via Redux state
  return dispatch(
    connected({
      id: networkId,
      name: network.name,
      account: accounts[0],
      web3,
      web3WS,
    })
  );
};

export type Action =
  | ExtractReturn<typeof connected>
  | ExtractReturn<typeof fail>;
