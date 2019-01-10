import {
  browserUtils,
  Polymath,
  PolymathNetworkParams,
} from '@polymathnetwork/sdk';
import { constants } from '@polymathnetwork/new-shared';
import {
  POLYMATH_REGISTRY_ADDRESS_LOCAL,
  POLYMATH_REGISTRY_ADDRESS_KOVAN,
  NETWORK_WS_PROVIDER_LOCAL,
  NETWORK_WS_PROVIDER_KOVAN,
} from '~/constants';

interface NetworkConfig {
  [networkId: number]: PolymathNetworkParams;
}

let kovanConfig: NetworkConfig = {};
let localConfig: NetworkConfig = {};

if (POLYMATH_REGISTRY_ADDRESS_KOVAN) {
  kovanConfig = {
    [constants.NetworkIds.Kovan]: {
      polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_KOVAN,
      wsProviderUrl: NETWORK_WS_PROVIDER_KOVAN,
    },
  };
}

if (POLYMATH_REGISTRY_ADDRESS_LOCAL) {
  localConfig = {
    [constants.NetworkIds.Local]: {
      polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      wsProviderUrl: NETWORK_WS_PROVIDER_LOCAL,
    },
  };
}

const networkParams = {
  ...kovanConfig,
  ...localConfig,
};

const networkId = browserUtils.getNetworkId() as number;
const networkParamsToUse = networkParams[networkId];

if (!networkParamsToUse) {
  throw new Error(`No network params were found for networkId "${networkId}"`);
}

export const polyClient = new Polymath(networkParamsToUse);
