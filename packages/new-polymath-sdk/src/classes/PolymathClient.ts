import Web3 from 'web3';
import { HttpProvider } from 'web3/providers';
import { types } from '@polymathnetwork/new-shared';
import { PolyToken } from '~/lowLevel/PolyToken';
import { Wallet } from './Wallet';
import { LowLevel } from '~/lowLevel';
import { PolymathRegistry } from '~/lowLevel/PolymathRegistry';
import { PolymathBaseContext, PolymathContext } from '~/types';
import { SecurityTokenRegistry } from '~/lowLevel/SecurityTokenRegistry';

interface Params {
  provider: HttpProvider;
}

// FIXME @RafaelVidaurre: Should be in polymath shared, move when sure
enum NetworkIds {
  Kovan = 42,
  Local = 15,
}

export class PolymathClient {
  public web3: Web3;
  public provider: HttpProvider;
  public networkId: number = -1;
  private lowLevel: LowLevel;

  private contexts: {
    [networkId: number]: PolymathContext;
  } = {};

  constructor({ provider }: Params) {
    this.provider = provider;
    this.web3 = new Web3(this.provider);
    // FIXME @RafaelVidaurre: Temp name
    this.lowLevel = new LowLevel(this.web3);
  }

  public async connect() {
    this.networkId = await this.web3.eth.net.getId();
    const [account] = await this.web3.eth.getAccounts();

    await this.lowLevel.initialize();

    const baseContext: PolymathBaseContext = {
      polyToken: this.lowLevel.polyToken as PolyToken,
      polymathRegistry: this.lowLevel.polymathRegistry as PolymathRegistry,
      securityTokenRegistry: this.lowLevel
        .polymathRegistry as SecurityTokenRegistry,
      getTokenContract: this.getTokenContract,
      isTestnet: this.isTestnet,
    };

    const currentWallet = new Wallet({ address: account }, baseContext);

    this.contexts[this.networkId] = {
      ...baseContext,
      currentWallet,
    };
  }

  /**
   * Reserve a Security Token
   */
  public reserveSecurityToken() {
    //
  }

  private getTokenContract(token: types.Tokens) {
    switch (token) {
      case types.Tokens.Poly:
        return this.polyToken;
      default: {
        throw new Error(`No contract for token: "${token}"`);
      }
    }
  }

  private get context() {
    return this.contexts[this.networkId];
  }

  private get polyToken() {
    return this.context.polyToken;
  }

  public get isTestnet() {
    return (
      this.networkId === NetworkIds.Kovan || this.networkId === NetworkIds.Local
    );
  }
}
