import Web3 from 'web3';
import { PolyToken } from '~/lowLevel/PolyToken';
import { PolymathRegistry } from './PolymathRegistry';
// NOTE @RafaelVidaurre: Temporary module to interact directly with
// the smart contracts while we wait for the LowLevel API to be implemented

/**
 * 1. Has initialization method
 * 2. Holds contract instances
 */

export class LowLevel {
  public web3: Web3;
  public polymathRegistry?: PolymathRegistry;
  public polyToken?: PolyToken;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  public async isTestnet() {
    const networkId = await this.web3.eth.net.getId();

    // FIXME @RafaelVidaurre: DRY this
    return networkId !== 1;
  }

  public async initialize() {
    const isTestnet = await this.isTestnet();

    this.polymathRegistry = new PolymathRegistry({
      // FIXME @RafaelVidaurre: Remove hardcoded value
      address: '0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f',
      web3: this.web3,
    });

    const polyTokenAddress = this.polymathRegistry.getAddress('PolyToken');

    this.polyToken = new PolyToken({
      address: polyTokenAddress,
      web3: this.web3,
      isTestnet,
    });
  }
}
