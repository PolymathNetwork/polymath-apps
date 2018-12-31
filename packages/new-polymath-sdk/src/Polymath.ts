import { HttpProvider, WebsocketProvider } from 'web3/providers';
import { BigNumber } from 'bignumber.js';
import { PolyToken } from '~/LowLevel/PolyToken';
import { LowLevel } from '~/LowLevel';
import { PolymathRegistry } from '~/LowLevel/PolymathRegistry';
import { SecurityTokenRegistry } from '~/LowLevel/SecurityTokenRegistry';
import { Context } from '~/Context';
import { ModuleRegistry } from '~/LowLevel/ModuleRegistry';
import { TaxWithholding } from '~/types';
import { Dividend } from '~/LowLevel/types';
import { SecurityToken } from '~/entities';
import {
  ReserveSecurityToken,
  EnableDividendModules,
  CreateCheckpoint,
  CreateErc20DividendDistribution,
  CreateEtherDividendDistribution,
} from './procedures';
import { CreateSecurityToken } from '~/procedures/CreateSecurityToken';
import * as entities from '~/entities';

export type EntityClasses = typeof entities;

export interface PolymathNetworkParams {
  httpProvider?: HttpProvider;
  httpProviderUrl?: string;
  wsProvider?: WebsocketProvider;
  wsProviderUrl?: string;
  polymathRegistryAddress: string;
}

const createContextualizedEntity = (
  ClassToContextualize: EntityClasses,
  polyClient: Polymath
) => {
  class ContextualizedEntity extends ClassToContextualize {
    constructor(params: any) {
      super(params, polyClient);
    }
  }
  return ContextualizedEntity;
};

// TODO @RafaelVidaurre: Fix typing here
interface ContextualizedEntityClasses {
  SecurityToken: any;
}

export class Polymath {
  public httpProvider: HttpProvider = {} as HttpProvider;
  public httpProviderUrl: string = '';
  public networkId: number = -1;
  public isUnsupported: boolean = false;
  public isConnected: boolean = false;
  public polymathRegistryAddress: string = '';
  private lowLevel: LowLevel = {} as LowLevel;
  private context: Context = {} as Context;
  private entityClasses: ContextualizedEntityClasses = {} as ContextualizedEntityClasses;

  constructor(params: PolymathNetworkParams) {
    const { polymathRegistryAddress, httpProvider, httpProviderUrl } = params;
    this.polymathRegistryAddress = polymathRegistryAddress;

    if (httpProvider) {
      this.httpProvider = httpProvider;
    }
    if (httpProviderUrl) {
      this.httpProviderUrl = httpProviderUrl;
    }
  }

  public async connect() {
    const { lowLevel, polymathRegistryAddress } = this;
    this.networkId = await lowLevel.getNetworkId();
    const account = await lowLevel.getAccount();

    if (this.httpProvider) {
      this.lowLevel = new LowLevel({ provider: this.httpProvider });
    } else if (this.httpProviderUrl) {
      this.lowLevel = new LowLevel({ provider: this.httpProviderUrl });
    } else {
      this.lowLevel = new LowLevel();
    }

    if (!polymathRegistryAddress) {
      throw new Error(
        `Polymath registry address for network id "${
          this.networkId
        }" was not found`
      );
    }

    if (!account) {
      throw new Error(
        "No account found. If you are using node, make sure you've not" +
          ' forgotten to add a private key. If you are using Metamask make sure ethereum.enable() was called first'
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

    this.entityClasses = {
      SecurityToken: createContextualizedEntity(SecurityToken, this),
    };

    return this;
  }

  public async createSecurityToken(args: {
    symbol: string;
    name: string;
    detailsUrl?: string;
    divisible: boolean;
  }) {
    const transaction = new CreateSecurityToken(args, this.context);
    return await transaction.prepare();
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

  public get SecurityToken() {
    return this.entityClasses.SecurityToken;
  }
}
