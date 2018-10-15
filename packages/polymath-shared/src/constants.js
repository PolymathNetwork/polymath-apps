const KOVAN_NETWORK_ID = 42;
const MAINNET_NETWORK_ID = 1;

const networkAddresses = {
  [KOVAN_NETWORK_ID]: {
    PolymathRegistry: '0x05a6519e49e34239f78167abf293d94dae61b299',
    TickerRegistry: '0xc9af1d88fe48c8a6aa8677a29a89b0a6ae78f5a8',
    ModuleRegistry: '0x961913dcbe2f36176bf25774337f3277796820eb',
    SecurityTokenRegistry: '0xced6e4ec2ac5425743bf4edf4d4e476120b8fc72',
    // TODO @RafaelVidaurre: Check old vs new version
    CappedSTOFactory: '0xde4f3cfb6b214e60c4e69e6dfc95ede3c4e3d709',
    GeneralPermissionManagerFactory:
      '0x6f5fec2934a34d2e2374042cca6505f1c87ef79b',
    CountTransferManagerFactory: '0xb540b6fa752a91c7e7834523172309e543a99a06',
    PercentageTransferManagerFactory:
      '0xfe908f07e6db57aa6bbd8374e59aac86b60374b0',
  },
  [MAINNET_NETWORK_ID]: {
    PolymathRegistry: '0x06595656b93ce14834f0d22b7bbda4382d5ab510',
    TickerRegistry: '0xc31714e6759a1ee26db1d06af1ed276340cd4233',
    ModuleRegistry: '0x31d85fffd7e38bd42d2ae0409ac149e3ef0fd92c',
    SecurityTokenRegistry: '0xef58491224958d978facf55d2120c55a24516b98',
    // TODO @RafaelVidaurre: Check old vs new version
    CappedSTOFactory: '0x2aa1b133f464ac08f66c2f702581d014e4603d31',
    GeneralPermissionManagerFactory:
      '0xeba0348e243f2de2f1687060f9c795ac279c66af',
    CountTransferManagerFactory: '0xa662a05647a8e713be1bed193c094805d20471ff',
    PercentageTransferManagerFactory:
      '0x3870ee581a0528d24a6216311fcfa78f95a00593',
  },
};

/**
 * Gets an obkject containing addresses for the relevant smart contracts in
 * a given network
 *
 * @param networkId - id of the network to get Smart Contract addresses
 * from. Usually set through Metamask on the client
 */
export function getAddressesByNetwork(contractName: string, networkId: string) {
  const addresses = networkAddresses[networkId];
  let contractAddress = addresses && addresses[contractName];

  if (contractAddress) {
    return contractAddress;
  }

  // Attempt to get address from artifact
  const jsonArtifact = require(`./fixtures/contracts/${contractName}.json`);
  contractAddress =
    jsonArtifact &&
    jsonArtifact.networks &&
    jsonArtifact.networks[networkId] &&
    jsonArtifact.networks[networkId].address;

  if (!contractAddress) {
    throw new Error(
      `No contract address found for contract "${contractName}" on network "${networkId}". Are the contracts correctly deployed?`
    );
  }
  return contractAddress;
}
