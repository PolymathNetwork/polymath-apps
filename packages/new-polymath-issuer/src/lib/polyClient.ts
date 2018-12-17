import { browserUtils } from '@polymathnetwork/sdk';
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

// NOTE @RafaelVidaurre: Temporarily using a mock until this is implemented
// export const polyClient = new PolymathClient(params);

// MOCK Poly Client class

export class MockPolymathClient {
  private params: NetworkParams;
  private loggedIn = false;
  private initialized = false;
  private wallet?: { id: string; address: string };

  constructor(params: NetworkParams) {
    this.params = params;
  }

  public async initialize() {
    this.initialized = true;
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
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

const networkId = browserUtils.getNetworkId();

export const polyClient = new MockPolymathClient(networkParams[networkId]);
