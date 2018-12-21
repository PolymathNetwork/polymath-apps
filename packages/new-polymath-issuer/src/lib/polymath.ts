import { browserUtils, Polymath } from '@polymathnetwork/sdk';
import { constants } from '@polymathnetwork/new-shared';
import {
  POLYMATH_REGISTRY_ADDRESS_LOCAL,
  POLYMATH_REGISTRY_ADDRESS_KOVAN,
} from '~/constants';

interface NetworkParams {
  polymathRegistryAddress: string;
  wsProviderUrl: string;
}
interface NetworkConfig {
  [networkId: string]: NetworkParams;
}

let kovanConfig: NetworkConfig = {};
let localConfig: NetworkConfig = {};

if (POLYMATH_REGISTRY_ADDRESS_KOVAN) {
  kovanConfig = {
    [constants.NetworkIds.Kovan]: {
      polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_KOVAN,
      wsProviderUrl: 'bar',
    },
  };
}

if (POLYMATH_REGISTRY_ADDRESS_LOCAL) {
  localConfig = {
    [constants.NetworkIds.Local]: {
      polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      wsProviderUrl: 'foo',
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
