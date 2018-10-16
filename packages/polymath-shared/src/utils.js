import { NETWORKS } from './constants';
import type { NetworkId } from './constants';

/**
 * Gets an object containing addresses for the relevant smart contracts in
 * a given network
 *
 * @param networkId - id of the network to get Smart Contract addresses from.
 * Usually set through Metamask
 */
export function getAddressesByNetwork(networkId: NetworkId) {
  const addresses = NETWORKS[networkId];

  // let contractAddress = addresses;

  // if (contractAddress) {
  //   return contractAddress;
  // }

  // // Attempt to get address from artifact
  // const jsonArtifact = require(`./fixtures/contracts/${contractName}.json`);
  // contractAddress =
  //   jsonArtifact &&
  //   jsonArtifact.networks &&
  //   jsonArtifact.networks[networkId] &&
  //   jsonArtifact.networks[networkId].address;

  // if (!contractAddress) {
  //   throw new Error(
  //     `No contract address found for contract "${contractName}" on network "${networkId}". Are the contracts correctly deployed?`
  //   );
  // }
  // return contractAddress;
}
