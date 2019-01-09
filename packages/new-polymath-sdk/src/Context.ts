import { types } from '@polymathnetwork/new-shared';
import { PolyToken } from '~/LowLevel/PolyToken';
import { PolymathRegistry } from '~/LowLevel/PolymathRegistry';
import { SecurityTokenRegistry } from '~/LowLevel/SecurityTokenRegistry';
import { ModuleRegistry } from '~/LowLevel/ModuleRegistry';
import { Wallet } from '~/Wallet';

interface Params {
  polyToken: PolyToken;
  polymathRegistry: PolymathRegistry;
  securityTokenRegistry: SecurityTokenRegistry;
  moduleRegistry: ModuleRegistry;
  isTestnet: boolean;
  accountAddress: string;
}

export class Context {
  public polyToken: PolyToken;
  public polymathRegistry: PolymathRegistry;
  public securityTokenRegistry: SecurityTokenRegistry;
  public moduleRegistry: ModuleRegistry;
  public isTestnet: boolean;
  public currentWallet: Wallet;
  constructor(params: Params) {
    const {
      polyToken,
      polymathRegistry,
      securityTokenRegistry,
      moduleRegistry,
      isTestnet,
      accountAddress,
    } = params;

    this.polyToken = polyToken;
    this.polymathRegistry = polymathRegistry;
    this.securityTokenRegistry = securityTokenRegistry;
    this.moduleRegistry = moduleRegistry;
    this.isTestnet = isTestnet;
    this.currentWallet = new Wallet({ address: accountAddress }, this);
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
}
