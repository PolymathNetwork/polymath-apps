import { HttpProvider, WebsocketProvider } from 'web3/providers';
import { types, constants } from '@polymathnetwork/new-shared';
import { PolyToken } from '~/LowLevel/PolyToken';
import { Erc20 } from '~/LowLevel/Erc20';
import { LowLevel } from '~/LowLevel';
import { PolymathRegistry } from '~/LowLevel/PolymathRegistry';
import { SecurityTokenRegistry } from '~/LowLevel/SecurityTokenRegistry';
import { Wallet } from './Wallet';
import { ReserveSecurityToken } from './transactions/ReserveSecurityToken';
import { Context } from './Context';
import { ModuleRegistry } from '~/LowLevel/ModuleRegistry';
import { EnableDividendModules } from './transactions/EnableDividendModules';
import { CreateCheckpoint } from './transactions/CreateCheckpoint';
import { CreateErc20DividendDistribution } from './transactions/CreateErc20DividendDistribution';
import { CreateEtherDividendDistribution } from '~/classes/transactions/CreateEtherDividendDistribution';
import { TaxWithholding } from '~/types';
import { Dividend } from '~/LowLevel/types';

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

    return this;
  }

  /**
   * Reserve a Security Token
   */
  public async reserveSecurityToken(args: { symbol: string; name: string }) {
    const transaction = new ReserveSecurityToken(args, this.context);
    return await transaction.prepare();
  }

  /**
   * Enable ERC20 and ETH dividend modules
   */
  public async enableDividendModules(args: { symbol: string }) {
    const transaction = new EnableDividendModules(args, this.context);
    return await transaction.prepare();
  }

  /**
   * Create investor supply checkpoint at the current date
   */
  public async createCheckpoint(args: { symbol: string }) {
    const transaction = new CreateCheckpoint(args, this.context);
    return await transaction.prepare();
  }

  /**
   * Distribute dividends in POLY
   */
  public async distributePolyDividends(args: {
    symbol: string;
    maturityDate: Date;
    expiryDate: Date;
    amount: number;
    checkpointId: number;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholding[];
  }) {
    const polyAddress = this.context.polyToken.address;
    const transaction = new CreateErc20DividendDistribution(
      {
        erc20Address: polyAddress,
        ...args,
      },
      this.context
    );
    return await transaction.prepare();
  }

  /**
   * Distribute dividends in a specified ERC20 token
   */
  public async distributeErc20Dividends(args: {
    symbol: string;
    maturityDate: Date;
    expiryDate: Date;
    erc20Address: string;
    amount: number;
    checkpointId: number;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholding[];
  }) {
    const transaction = new CreateErc20DividendDistribution(args, this.context);
    return await transaction.prepare();
  }

  /**
   * Distribute dividends in ETH
   */
  public async distributeEtherDividends(args: {
    symbol: string;
    maturityDate: Date;
    expiryDate: Date;
    erc20Address: string;
    amount: number;
    checkpointId: number;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholding[];
  }) {
    const transaction = new CreateEtherDividendDistribution(args, this.context);
    return await transaction.prepare();
  }

  /**
   * Retrieve list of checkpoints and their corresponding dividends
   */
  public async getCheckpoints(args: { symbol: string }) {
    const { securityTokenRegistry } = this.context;
    const { symbol } = args;

    const securityToken = await securityTokenRegistry.getSecurityToken(symbol);

    const erc20Module = await securityToken.getErc20DividendModule();
    const etherModule = await securityToken.getEtherDividendModule();

    let erc20Dividends: Dividend[] = [];
    let etherDividends: Dividend[] = [];

    if (erc20Module) {
      erc20Dividends = await erc20Module.getDividends();
    }

    if (etherModule) {
      etherDividends = await etherModule.getDividends();
    }

    const checkpoints = await securityToken.getCheckpoints();

    return checkpoints.map(checkpoint => {
      const checkpointDividends = [...erc20Dividends, ...etherDividends].filter(
        dividend => dividend.checkpointId === checkpoint.id
      );

      return {
        ...checkpoint,
        dividends: checkpointDividends,
      };
    });
  }
}
