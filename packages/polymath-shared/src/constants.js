// @flow

import PolyTokenFaucetArtifacts from './fixtures/contracts/PolyTokenFaucet.json';
import PolymathRegistryArtifacts from './fixtures/contracts/PolymathRegistry.json';
import TickerRegistryArtifacts from './fixtures/contracts/TickerRegistry.json';
import ModuleRegistryArtifacts from './fixtures/contracts/ModuleRegistry.json';
import SecurityTokenRegistryArtifacts from './fixtures/contracts/SecurityTokenRegistry.json';
import CappedSTOFactoryArtifacts from './fixtures/contracts/CappedSTOFactory.json';
import GeneralPermissionManagerFactoryArtifacts from './fixtures/contracts/GeneralPermissionManagerFactory.json';
import PercentageTransferManagerFactoryArtifacts from './fixtures/contracts/PercentageTransferManagerFactory.json';
import CountTransferManagerFactoryArtifacts from './fixtures/contracts/CountTransferManagerFactory.json';
import USDTieredSTOFactoryArtifacts from './fixtures/contracts/USDTieredSTOFactoryArtifacts.json';

export const KOVAN_NETWORK_ID = 42;
export const MAINNET_NETWORK_ID = 1;
export const LOCAL_NETWORK_ID = 15;

const NetworkIds = {
  KOVAN_NETWORK_ID,
  MAINNET_NETWORK_ID,
  LOCAL_NETWORK_ID,
};

const DEPLOYMENT_STAGE =
  process.env.REACT_APP_DEPLOYMENT_STAGE || process.env.DEPLOYMENT_STAGE;

if (process.env.DEPLOYMENT_STAGE && process.env.REACT_APP_DEPLOYMENT_STAGE) {
  throw new Error(
    'Cannot set both "REACT_APP_DEPLOYMENT_STAGE" and "DEPLOYMENT_STAGE" env vars. Use only one'
  );
}

if (!DEPLOYMENT_STAGE) {
  // TODO @RafaelVidaurre: Move to common env validation utility
  throw new Error(
    'no deployment stage env var has been set. Set either "DEPLOYMENT_STAGE" or "REACT_APP_DEPLOYMENT_STAGE"'
  );
}

type NetworkId = $Keys<typeof NetworkIds>;
type NetworkAddresses = {
  [networkId: NetworkId]: {
    [contractName: string]: string,
  },
};

/**
 * NOTE @RafaelVidaurre: In Kovan we use the PolyFaucetTokenAddress as the PolyToken
 * address.
 * This is because the faucet is a decorated version of the token.
 * This is only used for test networks.
 */

const localAddresses = {
  PolyToken: PolyTokenFaucetArtifacts.networks[LOCAL_NETWORK_ID].address,
  PolyTokenFaucet: PolyTokenFaucetArtifacts.networks[LOCAL_NETWORK_ID].address,
  PolymathRegistry:
    PolymathRegistryArtifacts.networks[LOCAL_NETWORK_ID].address,
  TickerRegistry: TickerRegistryArtifacts.networks[LOCAL_NETWORK_ID].address,
  ModuleRegistry: ModuleRegistryArtifacts.networks[LOCAL_NETWORK_ID].address,
  SecurityTokenRegistry:
    SecurityTokenRegistryArtifacts.networks[LOCAL_NETWORK_ID].address,
  CappedSTOFactory:
    CappedSTOFactoryArtifacts.networks[LOCAL_NETWORK_ID].address,
  GeneralPermissionManagerFactory:
    GeneralPermissionManagerFactoryArtifacts.networks[LOCAL_NETWORK_ID].address,
  PercentageTransferManagerFactory:
    PercentageTransferManagerFactoryArtifacts.networks[LOCAL_NETWORK_ID]
      .address,
  CountTransferManagerFactory:
    CountTransferManagerFactoryArtifacts.networks[LOCAL_NETWORK_ID],
  USDTieredSTOFactory: USDTieredSTOFactoryArtifacts.netwoeks[LOCAL_NETWORK_ID],
};

const kovanStagingPolyFaucetAddress =
  '0xe2b733524f1a630519d1b14811cafffd41ad26e5';
const kovanStagingAddresses = {
  PolyTokenFaucet: kovanStagingPolyFaucetAddress,
  PolyToken: kovanStagingPolyFaucetAddress,
  PolymathRegistry: '0x40b53ebd7e0d4a5cf7112371e2552eb153e1087c',
  TickerRegistry: '0x762af9b4d8c9e4affb92091479ce0524cd66001c',
  ModuleRegistry: '0x3ac848b3e94b78d5acc3f8e3c41cae92d59e2bfd',
  SecurityTokenRegistry: '0xeae834e007af3c081722f7f97003fca321c1470e',
  CappedSTOFactory: '0xf2cc7915fe48d9a709a1199cb018dcc27c114946',
  GeneralPermissionManagerFactory: '0x08b056dfd4f0b5e9ed8f6dfbff3163107384b857',
  CountTransferManagerFactory: '0x93b6ef91e4ea396594c18c88de5d31c566cabdf3',
  PercentageTransferManagerFactory:
    '0xeb3e23b507ed8d71ef9b0a7ca31af6a4e20c0143',
  USDTieredSTOFactory:
    '0x2f414c1d14a063766e3ff91f2edd01d7338a6c696cbcd016312cd15858658a95',
};

const kovanProductionPolyFaucetAddress =
  '0xb06d72a24df50d4e2cac133b320c5e7de3ef94cb';
const kovanProductionAddresses = {
  PolyTokenFaucet: kovanProductionPolyFaucetAddress,
  PolyToken: kovanProductionPolyFaucetAddress,
  PolymathRegistry: '0x05a6519e49e34239f78167abf293d94dae61b299',
  TickerRegistry: '0xc9af1d88fe48c8a6aa8677a29a89b0a6ae78f5a8',
  ModuleRegistry: '0x961913dcbe2f36176bf25774337f3277796820eb',
  SecurityTokenRegistry: '0xced6e4ec2ac5425743bf4edf4d4e476120b8fc72',
  CappedSTOFactory: '0xde4f3cfb6b214e60c4e69e6dfc95ede3c4e3d709',
  GeneralPermissionManagerFactory: '0x6f5fec2934a34d2e2374042cca6505f1c87ef79b',
  CountTransferManagerFactory: '0xb540b6fa752a91c7e7834523172309e543a99a06',
  PercentageTransferManagerFactory:
    '0xfe908f07e6db57aa6bbd8374e59aac86b60374b0',
};

export const _STAGING_ADDRESSES = {
  [KOVAN_NETWORK_ID]: kovanStagingAddresses,
};

export const _LOCAL_ADDRESSES = {
  [KOVAN_NETWORK_ID]: kovanStagingAddresses,
  [LOCAL_NETWORK_ID]: localAddresses,
};

export const _PRODUCTION_ADDRESSES = {
  [KOVAN_NETWORK_ID]: kovanProductionAddresses,
  [MAINNET_NETWORK_ID]: {
    PolyToken: '0x118A0df120cfB097aaD3A70914562F803A5bE45C',
    PolymathRegistry: '0x06595656b93ce14834f0d22b7bbda4382d5ab510',
    TickerRegistry: '0xc31714e6759a1ee26db1d06af1ed276340cd4233',
    ModuleRegistry: '0x31d85fffd7e38bd42d2ae0409ac149e3ef0fd92c',
    SecurityTokenRegistry: '0xef58491224958d978facf55d2120c55a24516b98',
    CappedSTOFactory: '0x2aa1b133f464ac08f66c2f702581d014e4603d31',
    GeneralPermissionManagerFactory:
      '0xeba0348e243f2de2f1687060f9c795ac279c66af',
    CountTransferManagerFactory: '0xa662a05647a8e713be1bed193c094805d20471ff',
    PercentageTransferManagerFactory:
      '0x3870ee581a0528d24a6216311fcfa78f95a00593',
  },
};

let networkAddresses: NetworkAddresses;

switch (DEPLOYMENT_STAGE) {
  case 'staging': {
    networkAddresses = _STAGING_ADDRESSES;
    break;
  }
  case 'production': {
    networkAddresses = _PRODUCTION_ADDRESSES;
    break;
  }
  case 'local': {
    networkAddresses = _LOCAL_ADDRESSES;
    break;
  }
}

export const NETWORK_ADDRESSES = networkAddresses;
