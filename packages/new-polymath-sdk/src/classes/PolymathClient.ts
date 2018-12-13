import { HttpProvider, WebsocketProvider } from 'web3/providers';
import { types, constants } from '@polymathnetwork/new-shared';
import { PolyToken } from '~/LowLevel/PolyToken';
import { LowLevel } from '~/LowLevel';
import { PolymathRegistry } from '~/LowLevel/PolymathRegistry';
import { SecurityTokenRegistry } from '~/LowLevel/SecurityTokenRegistry';
import { Wallet } from './Wallet';
import { ReserveSecurityToken } from './transactions/ReserveSecurityToken';
import { Context } from './Context';
import { ModuleRegistry } from '~/LowLevel/ModuleRegistry';

interface Params {
  httpProvider?: HttpProvider;
  httpProviderUrl?: string;
  wsProvider?: WebsocketProvider;
  wsProviderUrl?: string;
  polymathRegistryAddress: string;
}

export class PolymathClient {
  public httpProvider: HttpProvider = {} as HttpProvider;
  public httpProviderUrl: string = '';
  public networkId: number = -1;
  public isUnsupported: boolean = false;
  public isConnected: boolean = false;
  public polymathRegistryAddress: string = '';
  private lowLevel: LowLevel = {} as LowLevel;

  private context: Context = {} as Context;

  constructor(params: Params) {
    const { polymathRegistryAddress, httpProvider, httpProviderUrl } = params;
    this.polymathRegistryAddress = polymathRegistryAddress;

    if (httpProvider) {
      this.lowLevel = new LowLevel({ provider: httpProvider });
    } else if (httpProviderUrl) {
      this.lowLevel = new LowLevel({ provider: httpProviderUrl });
    } else {
      this.lowLevel = new LowLevel();
    }
  }

  public async connect() {
    const { lowLevel, polymathRegistryAddress } = this;
    this.networkId = await lowLevel.getNetworkId();
    const account = await lowLevel.getAccount();

    if (!polymathRegistryAddress) {
      throw new Error(
        `Polymath registry address for network id "${
          this.networkId
        }" was not found`
      );
    }

    if (!account) {
      throw new Error(
        'No account found. Did you forget to pass the private key?'
      );
    }

    await this.lowLevel.initialize({ polymathRegistryAddress });

    this.context = new Context({
      polyToken: this.lowLevel.polyToken as PolyToken,
      polymathRegistry: this.lowLevel.polymathRegistry as PolymathRegistry,
      securityTokenRegistry: this.lowLevel
        .securityTokenRegistry as SecurityTokenRegistry,
      moduleRegistry: this.lowLevel.moduleRegistry as ModuleRegistry,
      isTestnet: lowLevel.isTestnet(),
      accountAddress: account,
    });

    this.isConnected = true;
  }

  /**
   * Reserve a Security Token
   */
  public async reserveSecurityToken(args: { symbol: string; name: string }) {
    const transaction = new ReserveSecurityToken(args, this.context);
    return await transaction.prepare();
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

  private get polyToken() {
    return this.context.polyToken;
  }
}
