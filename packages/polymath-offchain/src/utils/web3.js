// @flow

import { WEB3_NETWORK_WS } from '../constants';
import Web3 from 'web3';

const web3Client = new Web3(WEB3_NETWORK_WS);

let networkId;
const getNetworkId = async (): Promise<number> => {
  if (networkId) {
    return networkId;
  }
  networkId = await web3Client.eth.net.getId();

  return networkId;
};

export { web3Client, getNetworkId };
