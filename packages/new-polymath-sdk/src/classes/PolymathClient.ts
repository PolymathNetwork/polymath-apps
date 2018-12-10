import Web3 from 'web3';
import { HttpProvider, WebsocketProvider } from 'web3/providers';
import { types } from '@polymathnetwork/new-shared';
import { PolyToken } from '~/LowLevel/PolyToken';
import { Wallet } from './Wallet';
import { LowLevel } from '~/LowLevel';
import { PolymathRegistry } from '~/LowLevel/PolymathRegistry';
import { PolymathBaseContext, PolymathContext } from '~/types';
import { SecurityTokenRegistry } from '~/LowLevel/SecurityTokenRegistry';
import { ReserveSecurityToken } from './transactions/ReserveSecurityToken';

interface Params {
  httpProvider?: HttpProvider;
  wsProvider?: WebsocketProvider;
}
interface EthereumProvider extends HttpProvider {
  enable(): Promise<void>;
}

// FIXME @RafaelVidaurre: Should be in polymath shared, move when sure
enum NetworkIds {
  Kovan = 42,
  Local = 15,
}

export class PolymathClient {
  public web3: Web3 = {} as Web3;
  public httpProvider: HttpProvider = {} as HttpProvider;
  public networkId: number = -1;
  public isUnsupported: boolean = false;
  public isConnected: boolean = false;
  private lowLevel: LowLevel = {} as LowLevel;

  private contexts: {
    [networkId: number]: PolymathContext;
  } = {};

  constructor({ httpProvider }: Params = {}) {
    if (httpProvider) {
      this.httpProvider = httpProvider;
    } else {
      const browserProvider = this.getBrowserProvider();
      if (browserProvider === null) {
        this.isUnsupported = true;
        return;
      }

      this.httpProvider = browserProvider;
    }

    this.web3 = new Web3(this.httpProvider);
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
        .securityTokenRegistry as SecurityTokenRegistry,
      getTokenContract: this.getTokenContract,
      isTestnet: this.isTestnet,
    };

    const currentWallet = new Wallet({ address: account }, baseContext);

    this.contexts[this.networkId] = {
      ...baseContext,
      currentWallet,
    };
    this.isConnected = true;
  }

  /**
   * Reserve a Security Token
   */
  public async reserveSecurityToken(args: { symbol: string; name: string }) {
    const transaction = new ReserveSecurityToken(args, this.context);
    return await transaction.prepare();
  }

  private getBrowserProvider() {
    if (!window) {
      return null;
    }

    const win = window as {
      web3?: Web3;
      ethereum?: EthereumProvider;
    };
    const isModern = !!win.ethereum;
    const isLegacy = !isModern && !!win.web3;

    if (isModern) {
      const web3Provider = win.ethereum as EthereumProvider;
      return web3Provider;
    }
    if (isLegacy) {
      const web3Instance = win.web3 as Web3;
      return web3Instance.currentProvider as HttpProvider;
    }

    return null;
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
