import { PolyToken } from './LowLevel/PolyToken';
import { PolymathRegistry } from './LowLevel/PolymathRegistry';
import { SecurityTokenRegistry } from './LowLevel/SecurityTokenRegistry';
import { ModuleRegistry } from './LowLevel/ModuleRegistry';
import { Erc20 } from './LowLevel/Erc20';
import { Wallet } from './Wallet';

interface Params {
  polyToken: PolyToken;
  polymathRegistry: PolymathRegistry;
  securityTokenRegistry: SecurityTokenRegistry;
  moduleRegistry: ModuleRegistry;
  isTestnet: boolean;
  getErc20Token: (args: { address: string }) => Erc20;
  accountAddress?: string;
}

export class Context {
  public polyToken: PolyToken;
  public polymathRegistry: PolymathRegistry;
  public securityTokenRegistry: SecurityTokenRegistry;
  public moduleRegistry: ModuleRegistry;
  public isTestnet: boolean;
  public currentWallet?: Wallet;
  public getErc20Token: (args: { address: string }) => Erc20;
  constructor(params: Params) {
    const {
      polyToken,
      polymathRegistry,
      securityTokenRegistry,
      moduleRegistry,
      isTestnet,
      accountAddress,
      getErc20Token,
    } = params;

    this.polyToken = polyToken;
    this.polymathRegistry = polymathRegistry;
    this.securityTokenRegistry = securityTokenRegistry;
    this.moduleRegistry = moduleRegistry;
    this.isTestnet = isTestnet;
    if (accountAddress) {
      this.currentWallet = new Wallet({ address: accountAddress });
    }
    this.getErc20Token = getErc20Token;
  }
}
