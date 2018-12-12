import { PolymathClient } from '@polymathnetwork/sdk';
import { constants } from '@polymathnetwork/new-shared';
import {
  POLYMATH_REGISTRY_ADDRESS_LOCAL,
  POLYMATH_REGISTRY_ADDRESS_KOVAN,
} from '~/constants';

let kovanConfig = {};
let localConfig = {};

if (POLYMATH_REGISTRY_ADDRESS_KOVAN) {
  kovanConfig = {
    [constants.NetworkIds.Kovan]: {
      polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_KOVAN,
    },
  };
}

if (POLYMATH_REGISTRY_ADDRESS_LOCAL) {
  localConfig = {
    [constants.NetworkIds.Local]: {
      polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
    },
  };
}

const params = {
  addresses: {
    ...localConfig,
    ...kovanConfig,
  },
};
export const polyClient = new PolymathClient(params);
