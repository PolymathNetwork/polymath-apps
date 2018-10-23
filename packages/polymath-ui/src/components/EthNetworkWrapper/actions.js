// @flow

import Web3 from 'web3';

import getNetwork, { NETWORK_LOCAL, NETWORK_LOCALVM } from './networks';
import type { ExtractReturn } from './helpers';
import Contract, { setupContracts } from '@polymathnetwork/js';
import { txHash, txEnd } from '../TxModal/actions';

export type NetworkParams = {|
  id: number,
  name: string,
  account: string,
  web3: Web3,
  web3WS: Web3,
|};

export const CONNECTED = 'polymath-auth/CONNECTED';
const connected = (params: NetworkParams) => ({ type: CONNECTED, params });

export const FAIL = 'polymath-auth/FAIL';
const fail = (error: number) => ({ type: FAIL, error });

export type Action =
  | ExtractReturn<typeof connected>
  | ExtractReturn<typeof fail>;

const web3 = new Web3();
const web3WS = new Web3(); // since MetaMask doesn't support WebSockets we need this extra client for events subscribing

export const ERROR_NOT_INSTALLED = 1;
export const ERROR_LOCKED = 2;
export const ERROR_NETWORK = 3;
export const ERROR_DISCONNECTED = 4;

const initPolymathJs = async (params: {
  networkParams: Object,
  polymathRegistryAddress: string,
  dispatch: Function,
}) => {
  const { networkParams, polymathRegistryAddress, dispatch } = params;
  Contract.setParams({
    ...networkParams,
    txHashCallback: hash => dispatch(txHash(hash)),
    txEndCallback: receipt => dispatch(txEnd(receipt)),
  });

  // initialize polymath-js contracts with addresses from the polymath registry
  await setupContracts(polymathRegistryAddress);
};

export const init = (networks: Array<string>) => async (dispatch: Function) => {
  try {
    let id = undefined;
    if (typeof window.web3 !== 'undefined') {
      // Metamask/Mist
      web3.setProvider(window.web3.currentProvider);
      id = await web3.eth.net.getId();
    }

    const isLocalhost =
      String(id) === NETWORK_LOCAL ||
      String(id) === NETWORK_LOCALVM ||
      id === undefined;

    const network = getNetwork(id);

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

    const networkParams = {
      id,
      name,
      account,
      web3,
      web3WS,
    };

    await initPolymathJs({
      networkParams,
      dispatch,
      polymathRegistryAddress: network.polymathRegistryAddress,
    });

    dispatch(connected(networkParams));
  } catch (e) {
    if (![ERROR_LOCKED, ERROR_NETWORK].includes(Number(e.message))) {
      // eslint-disable-next-line
      console.error('polymath-auth', e);
      e.message = ERROR_NOT_INSTALLED;
    }
    dispatch(fail(e.message));
  }
};
