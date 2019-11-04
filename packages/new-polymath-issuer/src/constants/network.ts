import { PolymathNetworkParams } from '@polymathnetwork/sdk';
import { constants } from '@polymathnetwork/new-shared';

export const POLYMATH_REGISTRY_ADDRESS_LOCAL = process.env
  .POLYMATH_REGISTRY_ADDRESS_LOCAL as string;
export const POLYMATH_REGISTRY_ADDRESS_KOVAN = process.env
  .POLYMATH_REGISTRY_ADDRESS_KOVAN as string;
export const POLYMATH_REGISTRY_ADDRESS_GOERLI = process.env
  .POLYMATH_REGISTRY_ADDRESS_GOERLI as string;
export const WS_PROVIDER_LOCAL = process.env
  .NETWORK_WS_PROVIDER_LOCAL as string;
export const WS_PROVIDER_KOVAN = process.env
  .NETWORK_WS_PROVIDER_LOCAL as string;
export const WS_PROVIDER_GOERLI = process.env
  .NETWORK_WS_PROVIDER_LOCAL as string;
export const WS_PROVIDER_MAINNET = process.env
  .NETWORK_WS_PROVIDER_LOCAL as string;

interface NetworkConfig {
  [networkId: number]: PolymathNetworkParams;
}

let kovanConfig: NetworkConfig = {};
let goerliConfig: NetworkConfig = {};
let localConfig: NetworkConfig = {};

if (POLYMATH_REGISTRY_ADDRESS_KOVAN) {
  kovanConfig = {
    [constants.NetworkIds.Kovan]: {
      polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_KOVAN,
      wsProviderUrl: WS_PROVIDER_KOVAN,
    },
  };
}
if (POLYMATH_REGISTRY_ADDRESS_GOERLI) {
  goerliConfig = {
    [constants.NetworkIds.Goerli]: {
      polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_GOERLI,
      wsProviderUrl: WS_PROVIDER_GOERLI,
    },
  };
}
if (POLYMATH_REGISTRY_ADDRESS_LOCAL) {
  localConfig = {
    [constants.NetworkIds.Local]: {
      polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
      wsProviderUrl: WS_PROVIDER_LOCAL,
    },
  };
}

export const POLY_CLIENT_PARAMS = {
  ...kovanConfig,
  ...goerliConfig,
  ...localConfig,
};
