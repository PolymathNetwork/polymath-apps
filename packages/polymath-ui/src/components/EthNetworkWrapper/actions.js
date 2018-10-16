// @flow

import Web3 from 'web3';

import getNetwork from './networks';
import type { ExtractReturn } from './helpers';

export type NetworkParams = {|
  id: number,
  name: string,
  account: string,
  web3: Web3,
  web3WS: Web3,
|};

// FIXME @RafaelVidaurre: This shouldn't be the right way to do it, but
// this has to be here for now
const HARDCODED_NETWORK_ID = 15;

export const CONNECTED = 'polymath-auth/CONNECTED';
const connected = (params: NetworkParams) => ({ type: CONNECTED, params });

export const FAIL = 'polymath-auth/FAIL';
const fail = (error: number) => ({ type: FAIL, error });

export type Action =
  | ExtractReturn<typeof connected>
  | ExtractReturn<typeof fail>;

let web3;
let web3WS; // since MetaMask doesn't support WebSockets we need this extra client for events subscribing

// If new Metamask version
if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  web3WS = new Web3(window.ethereum);
} else {
  web3 = new Web3();
  web3WS = new Web3();
}

export const ERROR_NOT_INSTALLED = 1;
export const ERROR_LOCKED = 2;
export const ERROR_NETWORK = 3;
export const ERROR_DISCONNECTED = 4;
export const ERROR_ACCESS_REQUESTED = 5;
export const ERROR_ACCESS_DENIED = 6;

export const init = (networks: Array<string>) => async (dispatch: Function) => {
  if (typeof window.ethereum !== 'undefined') {
    const isMetamaskAuthorised = await window.ethereum.isEnabled();

    // If dapp not authorised
    if (!isMetamaskAuthorised) {
      try {
        dispatch(fail(ERROR_ACCESS_REQUESTED));

        // Request accounts access
        await window.ethereum.enable();
      } catch (e) {
        // User denied access
        dispatch(fail(ERROR_ACCESS_DENIED));
      }
    }
  }

  try {
    let id = undefined;

    if (typeof window.web3 !== 'undefined') {
      // Metamask/Mist
      web3.setProvider(window.web3.currentProvider);
      id = await web3.eth.net.getId();
    }

    // TODO @RafaelVidaurre: Make this code work with polymath in localhost
    const isLocalhost = Number(id) === HARDCODED_NETWORK_ID || id === undefined;
    const network = getNetwork(!isLocalhost ? id : undefined);

    if (
      network === undefined ||
      (!isLocalhost && !networks.includes(String(id)))
    ) {
      throw new Error(ERROR_NETWORK);
    }
    web3WS.setProvider(process.env.REACT_APP_NODE_WS || network.url);
    if (!id) {
      web3.setProvider(web3WS.currentProvider);
      id = await web3.eth.net.getId();
    }

    const name = network.name;
    const [account] = await web3.eth.getAccounts();
    if (id) {
      // https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#ear-listening-for-selected-account-changes
      setInterval(() => {
        web3.eth.getAccounts().then(accounts => {
          if (accounts[0] !== account) {
            window.location.reload();
          }
        });
        web3.eth.net.getId().then(_id => {
          if (id !== _id) {
            window.location.reload();
          }
        });
      }, 100);
    }
    if (!account) {
      throw new Error(ERROR_LOCKED);
    }

    // TODO @bshevchenko: https://github.com/INFURA/infura/issues/80 hack below
    web3WS.eth.subscribe('newBlockHeaders', error => {
      if (error) {
        // eslint-disable-next-line
        console.error('web3WS newBlockHeaders', error);
        dispatch(fail(ERROR_DISCONNECTED));
      }
    });

    // TODO @grsmto: Do proper dependency injection instead of sharing web3 instance via Redux state
    dispatch(connected({ id, name, account, web3, web3WS }));
  } catch (e) {
    if (
      ![
        ERROR_LOCKED,
        ERROR_NETWORK,
        ERROR_ACCESS_REQUESTED,
        ERROR_ACCESS_DENIED,
      ].includes(Number(e.message))
    ) {
      // eslint-disable-next-line
      console.error('polymath-auth', e);
      e.message = ERROR_NOT_INSTALLED;
    }
    dispatch(fail(e.message));
  }
};
