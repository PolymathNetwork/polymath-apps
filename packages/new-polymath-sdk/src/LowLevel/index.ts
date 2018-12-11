import Web3 from 'web3';
import { PolyToken } from './PolyToken';
import { PolymathRegistry } from './PolymathRegistry';
import { SecurityTokenRegistry } from './SecurityTokenRegistry';

/**
 * Temporary module to interact directly with
 * the smart contracts while we wait for the LowLevel API to be implemented
 */
export class LowLevel {
  public web3: Web3;
  public polymathRegistry?: PolymathRegistry;
  public polyToken?: PolyToken;
  public securityTokenRegistry?: SecurityTokenRegistry;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  public async isTestnet() {
    const networkId = await this.web3.eth.net.getId();

    // FIXME @RafaelVidaurre: DRY this
    return networkId !== 1;
  }

  public async initialize({
    polymathRegistryAddress,
  }: {
    polymathRegistryAddress: string;
  }) {
    const isTestnet = await this.isTestnet();

    this.polymathRegistry = new PolymathRegistry({
      // FIXME @RafaelVidaurre: Remove hardcoded value
      address: polymathRegistryAddress,
      web3: this.web3,
    });

    // TODO @RafaelVidaurre: Paralelize or initialize lazily

    const polyTokenAddress = await this.polymathRegistry.getAddress(
      'PolyToken'
    );
    const SecurityTokenRegistryAddress = await this.polymathRegistry.getAddress(
      'SecurityTokenRegistry'
    );

    this.polyToken = new PolyToken({
      address: polyTokenAddress,
      web3: this.web3,
      isTestnet,
    });

    this.securityTokenRegistry = new SecurityTokenRegistry({
      address: SecurityTokenRegistryAddress,
      web3: this.web3,
    });
  }
}
