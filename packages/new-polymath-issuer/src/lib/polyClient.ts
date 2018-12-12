// import { PolymathClient } from '@polymathnetwork/sdk';
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

// NOTE @RafaelVidaurre: Temporarily using a mock until this is implemented
// export const polyClient = new PolymathClient(params);

// MOCK Poly Client class

interface MockParams {
  addresses: {
    [networkId: string]: string;
  };
}

class MockPolymathClient {
  private params: MockParams;
  private loggedIn = false;
  private wallet?: { id: string; address: string };

  constructor(param: MockParams) {
    this.params = params;
  }

  public isLoggedIn() {
    return this.loggedIn;
  }

  public login() {
    this.loggedIn = true;
    this.wallet = {
      id: 'id1',
      address: '0x12345678910',
    };
  }

  get currentWallet() {
    return this.wallet;
  }
}

export const polyClient = new MockPolymathClient(params);
