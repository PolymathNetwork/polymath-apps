import { HttpProvider } from 'web3/providers';
import { PolyToken } from '~/LowLevel/PolyToken';
import { LowLevel } from '~/LowLevel';
import { PolymathRegistry } from '~/LowLevel/PolymathRegistry';
import { SecurityTokenRegistry } from '~/LowLevel/SecurityTokenRegistry';
import { Context } from '~/Context';
import { ModuleRegistry } from '~/LowLevel/ModuleRegistry';
import { TaxWithholding } from '~/types';
import {
  Dividend as LowLevelDividend,
  Checkpoint as LowLevelCheckpoint,
  DividendModuleTypes,
} from '~/LowLevel/types';
import { Dividend, Checkpoint } from '~/entities';

import {
  ReserveSecurityToken,
  EnableDividendModules,
  CreateCheckpoint,
  CreateErc20DividendDistribution,
  CreateEtherDividendDistribution,
} from './procedures';
import { CreateSecurityToken } from '~/procedures/CreateSecurityToken';
import { Entity } from '~/entities/Entity';
import { SecurityToken } from '~/entities';
import { Erc20DividendsModule } from '~/entities';
import { PolymathNetworkParams } from '~/types';

// TODO @RafaelVidaurre: Type this correctly. It should return a contextualized
// version of T
const createContextualizedEntity = <T extends typeof Entity>(
  ClassToContextualize: T,
  polyClient: Polymath
): T => {
  class ContextualizedEntity extends (ClassToContextualize as any) {
    constructor(params: { [key: string]: any }) {
      super(params, polyClient);
    }
  }

  return (ContextualizedEntity as any) as T;
};

interface ContextualizedEntities {
  SecurityToken: typeof SecurityToken;
  Dividend: typeof Dividend;
  Checkpoint: typeof Checkpoint;
  Erc20DividendsModule: typeof Erc20DividendsModule;
}

export class Polymath {
  public httpProvider: HttpProvider = (null as any) as HttpProvider;
  public httpProviderUrl: string = '';
  public networkId: number = -1;
  public isUnsupported: boolean = false;
  public isConnected: boolean = false;
  public polymathRegistryAddress: string = '';
  private lowLevel: LowLevel = {} as LowLevel;
  private context: Context = {} as Context;
  private entities: ContextualizedEntities;

  constructor(params: PolymathNetworkParams) {
    const { polymathRegistryAddress, httpProvider, httpProviderUrl } = params;
    this.polymathRegistryAddress = polymathRegistryAddress;

    if (httpProvider) {
      this.httpProvider = httpProvider;
    }
    if (httpProviderUrl) {
      this.httpProviderUrl = httpProviderUrl;
    }

    if (this.httpProvider) {
      this.lowLevel = new LowLevel({ provider: this.httpProvider });
    } else if (this.httpProviderUrl) {
      this.lowLevel = new LowLevel({ provider: this.httpProviderUrl });
    } else {
      this.lowLevel = new LowLevel();
    }

    // TODO @RafaelVidaurre: type this correctly
    this.entities = {
      SecurityToken: createContextualizedEntity(SecurityToken as any, this),
      Erc20DividendsModule: createContextualizedEntity(
        Erc20DividendsModule as any,
        this
      ),
      Dividend: createContextualizedEntity(Dividend as any, this),
      Checkpoint: createContextualizedEntity(Checkpoint as any, this),
    };
  }

  public connect = async () => {
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

    return this;
  };

  public createSecurityToken = async (args: {
    symbol: string;
    name: string;
    detailsUrl?: string;
    divisible: boolean;
  }) => {
    const procedure = new CreateSecurityToken(args, this.context);
    return await procedure.prepare();
  };

  /**
   * Reserve a Security Token
   */
  public reserveSecurityToken = async (args: {
    symbol: string;
    name: string;
  }) => {
    const procedure = new ReserveSecurityToken(args, this.context);
    const transactionQueue = await procedure.prepare();
    return transactionQueue;
  };

  /**
   * Enable dividend modules (ERC20, ETH or both)
   *
   * @param storageWalletAddress wallet that will receive reclaimed dividends and withheld taxes
   * @param types array containing the types of dividend modules to enable (will enable all if not present)
   */
  public enableDividendModules = async (args: {
    symbol: string;
    storageWalletAddress: string;
    types?: DividendModuleTypes[];
  }) => {
    const procedure = new EnableDividendModules(args, this.context);
    return await procedure.prepare();
  };

  /**
   * Create investor supply checkpoint at the current date
   */
  public createCheckpoint = async (args: { symbol: string }) => {
    const procedure = new CreateCheckpoint(args, this.context);
    return await procedure.prepare();
  };

  /**
   * Distribute dividends in POLY
   */
  public distributePolyDividends = async (args: {
    symbol: string;
    maturityDate: Date;
    expiryDate: Date;
    amount: number;
    checkpointId: number;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholding[];
  }) => {
    const polyAddress = this.context.polyToken.address;
    const procedure = new CreateErc20DividendDistribution(
      {
        erc20Address: polyAddress,
        ...args,
      },
      this.context
    );

    return await procedure.prepare();
  };

  /**
   * Distribute dividends in a specified ERC20 token
   */
  public distributeErc20Dividends = async (args: {
    symbol: string;
    maturityDate: Date;
    expiryDate: Date;
    erc20Address: string;
    amount: number;
    checkpointId: number;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholding[];
  }) => {
    const procedure = new CreateErc20DividendDistribution(args, this.context);
    return await procedure.prepare();
  };

  /**
   * Distribute dividends in ETH
   */
  public distributeEtherDividends = async (args: {
    symbol: string;
    maturityDate: Date;
    expiryDate: Date;
    erc20Address: string;
    amount: number;
    checkpointId: number;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholding[];
  }) => {
    const procedure = new CreateEtherDividendDistribution(args, this.context);
    return await procedure.prepare();
  };

  /**
   * Retrieve list of checkpoints and their corresponding dividends
   */
  public getCheckpoints = async (args: {
    symbol: string;
  }): Promise<Checkpoint[]> => {
    const { securityTokenRegistry } = this.context;
    const { symbol: securityTokenSymbol } = args;

    const securityToken = await securityTokenRegistry.getSecurityToken(
      securityTokenSymbol
    );
    const erc20Module = await securityToken.getErc20DividendModule();
    const etherModule = await securityToken.getEtherDividendModule();

    let erc20Dividends: LowLevelDividend[] = [];
    let etherDividends: LowLevelDividend[] = [];

    if (erc20Module) {
      erc20Dividends = await erc20Module.getDividends();
    }
    if (etherModule) {
      etherDividends = await etherModule.getDividends();
    }

    const checkpoints: LowLevelCheckpoint[] = await securityToken.getCheckpoints();

    const address = securityToken.address;
    const name = await securityToken.name();
    const stEntity = new this.SecurityToken({
      symbol: securityTokenSymbol,
      name,
      address,
    });
    const securityTokenId = stEntity.uid;

    return checkpoints.map(checkpoint => {
      const checkpointDividends = [...erc20Dividends, ...etherDividends].filter(
        dividend => dividend.checkpointId === checkpoint.index
      );

      const emptyCheckpoint = new this.Checkpoint({
        ...checkpoint,
        securityTokenId,
        securityTokenSymbol,
        dividends: [],
      });

      const dividends = checkpointDividends.map(
        dividend =>
          new this.Dividend({
            ...dividend,
            checkpointId: emptyCheckpoint.uid,
            securityTokenSymbol,
            securityTokenId,
          })
      );

      emptyCheckpoint.dividends = dividends;

      return emptyCheckpoint;
    });
  };

  public getCheckpoint = async (args: {
    symbol: string;
    checkpointIndex: number;
  }) => {
    const { symbol, checkpointIndex } = args;
    const checkpoints = await this.getCheckpoints({
      symbol,
    });

    const thisCheckpoint = checkpoints.find(
      checkpoint => checkpoint.index === checkpointIndex
    );

    return thisCheckpoint || null;
  };

  public getDividends = async (args: {
    symbol: string;
    checkpointIndex: number;
  }) => {
    const { symbol, checkpointIndex } = args;

    const thisCheckpoint = await this.getCheckpoint({
      symbol,
      checkpointIndex,
    });

    if (thisCheckpoint) {
      return thisCheckpoint.dividends;
    }

    return [];
  };

  public getErc20DividendsModule = async (args: { symbol: string }) => {
    const { securityTokenRegistry } = this.context;
    const { symbol: securityTokenSymbol } = args;

    const securityToken = await securityTokenRegistry.getSecurityToken(
      securityTokenSymbol
    );
    const erc20Module = await securityToken.getErc20DividendModule();

    const name = await securityToken.name();

    const securityTokenEntity = new this.SecurityToken({
      address: securityToken.address,
      symbol: securityTokenSymbol,
      name,
    });

    const constructorData = {
      securityTokenSymbol,
      securityTokenId: securityTokenEntity.uid,
    };

    if (erc20Module) {
      return new this.Erc20DividendsModule({
        address: erc20Module.address,
        ...constructorData,
      });
    }

    return null;
  };

  get SecurityToken() {
    return this.entities.SecurityToken;
  }

  get Checkpoint() {
    return this.entities.Checkpoint;
  }

  get Dividend() {
    return this.entities.Dividend;
  }

  get Erc20DividendsModule() {
    return this.entities.Erc20DividendsModule;
  }
}
