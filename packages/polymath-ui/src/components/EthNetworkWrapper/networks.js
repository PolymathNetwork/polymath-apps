// @flow

import {
  LOCAL_NETWORK_ID,
  LOCALVM_NETWORK_ID,
  ROPSTEN_NETWORK_ID,
  RINKEBY_NETWORK_ID,
  KOVAN_NETWORK_ID,
  MAINNET_NETWORK_ID,
} from '@polymathnetwork/shared/constants';

type Network = {
  name: string,
  url: string,
  polymathRegistryAddress: ?string,
};

const {
  REACT_APP_DEPLOYMENT_STAGE,
  REACT_APP_NETWORK_MAIN_WS,
  REACT_APP_NETWORK_KOVAN_WS,
  REACT_APP_NETWORK_LOCAL_WS,
  REACT_APP_NETWORK_LOCALVM_WS,
  REACT_APP_POLYMATH_REGISTRY_ADDRESS_LOCAL,
  REACT_APP_POLYMATH_REGISTRY_ADDRESS_KOVAN_STAGING,
  REACT_APP_POLYMATH_REGISTRY_ADDRESS_KOVAN_PRODUCTION,
  REACT_APP_POLYMATH_REGISTRY_ADDRESS_MAINNET,
} = process.env;

export default (id: string = LOCAL_NETWORK_ID): Network =>
  ({
    [MAINNET_NETWORK_ID]: {
      name: 'Mainnet',
      url: REACT_APP_NETWORK_MAIN_WS,
      polymathRegistryAddress: REACT_APP_POLYMATH_REGISTRY_ADDRESS_MAINNET,
    },
    [ROPSTEN_NETWORK_ID]: {
      name: 'Ropsten Testnet',
      url: 'wss://ropsten.infura.io/ws',
    },
    [RINKEBY_NETWORK_ID]: {
      name: 'Rinkeby Testnet',
      url: 'wss://rinkeby.infura.io/ws',
    },
    [KOVAN_NETWORK_ID]: {
      name: 'Kovan Testnet',
      url: REACT_APP_NETWORK_KOVAN_WS,
      polymathRegistryAddress:
        REACT_APP_DEPLOYMENT_STAGE === 'production'
          ? REACT_APP_POLYMATH_REGISTRY_ADDRESS_KOVAN_PRODUCTION
          : REACT_APP_POLYMATH_REGISTRY_ADDRESS_KOVAN_STAGING,
    },
    [LOCAL_NETWORK_ID]: {
      name: 'Localhost',
      url: REACT_APP_NETWORK_LOCAL_WS,
      polymathRegistryAddress: REACT_APP_POLYMATH_REGISTRY_ADDRESS_LOCAL,
    },
    [LOCALVM_NETWORK_ID]: {
      name: 'LocalVM',
      url: REACT_APP_NETWORK_LOCALVM_WS,
    },
  }[id]);
