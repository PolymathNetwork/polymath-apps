import { PolymathClient } from '@polymathnetwork/sdk';
import { constants } from '@polymathnetwork/new-shared';
import {
  POLYMATH_REGISTRY_ADDRESS_LOCAL,
  POLYMATH_REGISTRY_ADDRESS_KOVAN,
} from '~/constants';

const params = {
  addresses: {
    [constants.NetworkIds.Local]: {
      polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_LOCAL,
    },
    [constants.NetworkIds.Kovan]: {
      polymathRegistryAddress: POLYMATH_REGISTRY_ADDRESS_KOVAN,
    },
  },
};
export const client = new PolymathClient(params);
