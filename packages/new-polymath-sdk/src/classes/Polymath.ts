import Web3 from 'web3';
import { Provider } from 'web3/providers';
import { PolyToken } from '~/classes/PolyToken';
import { Wallet } from './Wallet';
import { types } from '@polymathnetwork/new-shared';

interface Params {
  provider: Provider;
}

// FIXME @RafaelVidaurre: Should be in polymath shared, move when sure
enum NetworkIds {
  Kovan = 42,
  Local = 15,
}

export class PolymathBase {
  public web3: Web3;
  public provider: Provider;
  public networkId: number = -1;

  private networks: {
    [networkId: number]: {
      wallet: Wallet;
      polyToken: PolyToken;
    };
  } = {};

  constructor({ provider }: Params) {
    this.provider = provider;
    this.web3 = new Web3(provider);
  }

  public async connect() {
    this.networkId = await this.web3.eth.net.getId();
    const [account] = await this.web3.eth.getAccounts();

    // Here goes the process to get all addresses for each network
    // Prolly just an "connect" method or something

    this.networks[this.networkId] = {
      wallet: new Wallet({ address: account }),
      polyToken: new PolyToken('someAddress'),
    };
  }

  public getTokenContract(token: types.Tokens) {
    switch (token) {
      case types.Tokens.Poly:
        return this.polyToken;
      default: {
        throw new Error(`No contract for token: "${token}"`);
      }
    }
  }

  private get network() {
    return this.networks[this.networkId];
  }

  public get polyToken() {
    return this.network.polyToken;
  }

  public get isTestnet() {
    return this.networkId === NetworkIds.Kovan || NetworkIds.Local;
  }

  public get currentWallet() {
    return this.network.wallet;
  }
}

// Temporary Hacky way to have good typing
export const Polymath = new PolymathBase({} as Params);
