import { HttpProvider } from 'web3/providers';
import { PolyToken } from '~/LowLevel/PolyToken';
import { LowLevel } from '~/LowLevel';
import { PolymathRegistry } from '~/LowLevel/PolymathRegistry';
import { SecurityTokenRegistry } from '~/LowLevel/SecurityTokenRegistry';
import { Context } from '~/Context';
import { ModuleRegistry } from '~/LowLevel/ModuleRegistry';
import { TaxWithholdingEntry } from '~/types';
import {
  Dividend as LowLevelDividend,
  Checkpoint as LowLevelCheckpoint,
  DividendModuleTypes,
} from '~/LowLevel/types';
import {
  Dividend as DividendEntity,
  Checkpoint as CheckpointEntity,
  TaxWithholding as TaxWithholdingEntity,
  SecurityToken as SecurityTokenEntity,
  Erc20DividendsModule as Erc20DividendsModuleEntity,
  EthDividendsModule as EthDividendsModuleEntity,
} from '~/entities';

import {
  ReserveSecurityToken,
  EnableDividendModules,
  CreateCheckpoint,
  CreateErc20DividendDistribution,
  CreateEtherDividendDistribution,
  SetDividendsTaxWithholdingList,
  PushDividendPayment,
  WithdrawTaxes,
} from './procedures';
import { CreateSecurityToken } from '~/procedures/CreateSecurityToken';
import { Entity } from '~/entities/Entity';
import { PolymathNetworkParams } from '~/types';
import BigNumber from 'bignumber.js';
import { includes } from 'lodash';
import { SetDividendsWallet } from '~/procedures/SetDividendsWallet';

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
  SecurityToken: typeof SecurityTokenEntity;
  Dividend: typeof DividendEntity;
  Checkpoint: typeof CheckpointEntity;
  Erc20DividendsModule: typeof Erc20DividendsModuleEntity;
  EthDividendsModule: typeof EthDividendsModuleEntity;
  TaxWithholding: typeof TaxWithholdingEntity;
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

  constructor() {
    // TODO @RafaelVidaurre: type this correctly
    this.entities = {
      SecurityToken: createContextualizedEntity(
        SecurityTokenEntity as any,
        this
      ),
      Erc20DividendsModule: createContextualizedEntity(
        Erc20DividendsModuleEntity as any,
        this
      ),
      EthDividendsModule: createContextualizedEntity(
        EthDividendsModuleEntity as any,
        this
      ),
      Dividend: createContextualizedEntity(DividendEntity as any, this),
      Checkpoint: createContextualizedEntity(CheckpointEntity as any, this),
      TaxWithholding: createContextualizedEntity(
        TaxWithholdingEntity as any,
        this
      ),
    };
  }

  public connect = async ({
    polymathRegistryAddress,
    httpProvider,
    httpProviderUrl,
  }: PolymathNetworkParams) => {
    let lowLevel: LowLevel;

    if (httpProvider) {
      this.httpProvider = httpProvider;
      lowLevel = new LowLevel({ provider: this.httpProvider });
    } else if (httpProviderUrl) {
      this.httpProviderUrl = httpProviderUrl;
      lowLevel = new LowLevel({ provider: this.httpProviderUrl });
    } else {
      lowLevel = new LowLevel();
    }

    this.lowLevel = lowLevel;
    this.polymathRegistryAddress = polymathRegistryAddress;

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

    await lowLevel.initialize({ polymathRegistryAddress });

    this.context = new Context({
      polyToken: lowLevel.polyToken as PolyToken,
      polymathRegistry: lowLevel.polymathRegistry as PolymathRegistry,
      securityTokenRegistry: lowLevel.securityTokenRegistry as SecurityTokenRegistry,
      moduleRegistry: lowLevel.moduleRegistry as ModuleRegistry,
      isTestnet: lowLevel.isTestnet(),
      getErc20Token: lowLevel.getErc20Token,
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
  public createPolyDividendDistribution = async (args: {
    symbol: string;
    maturityDate: Date;
    expiryDate: Date;
    amount: BigNumber;
    checkpointId: number;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholdingEntry[];
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
  public createErc20DividendDistribution = async (args: {
    symbol: string;
    maturityDate: Date;
    expiryDate: Date;
    erc20Address: string;
    amount: BigNumber;
    checkpointId: number;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholdingEntry[];
  }) => {
    const procedure = new CreateErc20DividendDistribution(args, this.context);
    return await procedure.prepare();
  };

  /**
   * Distribute dividends in ETH
   */
  public createEthDividendDistribution = async (args: {
    symbol: string;
    maturityDate: Date;
    expiryDate: Date;
    erc20Address: string;
    amount: BigNumber;
    checkpointId: number;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholdingEntry[];
  }) => {
    const procedure = new CreateEtherDividendDistribution(args, this.context);
    return await procedure.prepare();
  };

  /**
   * Set tax withtholding list for a type of dividends
   */
  public setDividendsTaxWithholdingList = async (args: {
    symbol: string;
    dividendType: DividendModuleTypes;
    investorAddresses: string[];
    percentages: number[];
  }) => {
    const procedure = new SetDividendsTaxWithholdingList(args, this.context);
    return await procedure.prepare();
  };

  /**
   * Push dividends payments for a dividend distribution
   */
  public pushDividendPayment = async (args: {
    symbol: string;
    dividendType: DividendModuleTypes;
    dividendId: number;
  }) => {
    const procedure = new PushDividendPayment(args, this.context);
    return await procedure.prepare();
  };

  /**
   * Change dividends module reclaiming wallet address
   */
  public setDividendsWallet = async (args: {
    symbol: string;
    dividendType: DividendModuleTypes;
    address: string;
  }) => {
    const procedure = new SetDividendsWallet(args, this.context);
    return await procedure.prepare();
  };

  /**
   * Withdraw taxes from a dividend distribution
   */
  public withdrawTaxes = async (args: {
    symbol: string;
    dividendType: DividendModuleTypes;
    dividendIndex: number;
  }) => {
    const procedure = new WithdrawTaxes(args, this.context);
    return await procedure.prepare();
  };

  /**
   * Retrieve a list of investor addresses and their corresponding tax withholding
   * percentages
   */
  public getDividendsTaxWithholdingList = async (args: {
    symbol: string;
    dividendType: DividendModuleTypes;
  }) => {
    const { securityTokenRegistry } = this.context;
    const { symbol: securityTokenSymbol, dividendType } = args;

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: securityTokenSymbol,
    });

    let dividendsModule;
    if (dividendType === DividendModuleTypes.Erc20) {
      dividendsModule = await securityToken.getErc20DividendModule();
    } else if (dividendType === DividendModuleTypes.Eth) {
      dividendsModule = await securityToken.getEtherDividendModule();
    }

    if (!dividendsModule) {
      throw new Error(
        'There is no attached dividend module of the specified type'
      );
    }

    const checkpointIndex = await securityToken.currentCheckpointId();

    const taxWithholdings = await dividendsModule.getTaxWithholdingList({
      checkpointIndex,
    });

    const name = await securityToken.name();

    const emptySecurityToken = new this.SecurityToken({
      symbol: securityTokenSymbol,
      address: securityToken.address,
      name,
    });

    return taxWithholdings.map(
      ({ address, percentage }) =>
        new this.TaxWithholding({
          investorAddress: address,
          percentage,
          securityTokenSymbol,
          securityTokenId: emptySecurityToken.uid,
          dividendType,
        })
    );
  };

  /**
   * Retrieve list of checkpoints and their corresponding dividends
   *
   * @param dividendTypes array of dividend types that should be returned. Default value is both
   */
  public getCheckpoints = async (args: {
    symbol: string;
    dividendTypes?: DividendModuleTypes[];
  }): Promise<CheckpointEntity[]> => {
    const { securityTokenRegistry } = this.context;
    const {
      symbol: securityTokenSymbol,
      dividendTypes = [DividendModuleTypes.Erc20, DividendModuleTypes.Eth],
    } = args;

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: securityTokenSymbol,
    });
    const erc20Module = await securityToken.getErc20DividendModule();
    const etherModule = await securityToken.getEtherDividendModule();

    let erc20Dividends: LowLevelDividend[] = [];
    let etherDividends: LowLevelDividend[] = [];

    if (erc20Module && includes(dividendTypes, DividendModuleTypes.Erc20)) {
      erc20Dividends = await erc20Module.getDividends();
    }
    if (etherModule && includes(dividendTypes, DividendModuleTypes.Eth)) {
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
    dividendTypes?: DividendModuleTypes[];
  }) => {
    const {
      symbol,
      checkpointIndex,
      dividendTypes = [DividendModuleTypes.Erc20, DividendModuleTypes.Eth],
    } = args;
    const checkpoints = await this.getCheckpoints({
      symbol,
      dividendTypes,
    });

    const thisCheckpoint = checkpoints.find(
      checkpoint => checkpoint.index === checkpointIndex
    );

    return thisCheckpoint || null;
  };

  public getDividends = async (args: {
    symbol: string;
    checkpointIndex: number;
    dividendTypes?: DividendModuleTypes[];
  }) => {
    const {
      symbol,
      checkpointIndex,
      dividendTypes = [DividendModuleTypes.Erc20, DividendModuleTypes.Eth],
    } = args;

    const thisCheckpoint = await this.getCheckpoint({
      symbol,
      checkpointIndex,
      dividendTypes,
    });

    if (thisCheckpoint) {
      return thisCheckpoint.dividends;
    }

    return [];
  };

  public getDividend = async (args: {
    symbol: string;
    dividendType: DividendModuleTypes;
    dividendIndex: number;
  }) => {
    const { symbol, dividendType, dividendIndex } = args;

    const checkpoints = await this.getCheckpoints({
      symbol,
      dividendTypes: [dividendType],
    });

    for (const checkpoint of checkpoints) {
      const { dividends } = checkpoint;

      const result = dividends.find(
        dividend => dividend.index === dividendIndex
      );

      if (result) {
        return result;
      }
    }

    throw new Error(
      'There is no dividend of the specified type with that index.'
    );
  };

  public getDividendsModule = async (args: {
    symbol: string;
    dividendType: DividendModuleTypes;
  }) => {
    const { securityTokenRegistry } = this.context;
    const { symbol: securityTokenSymbol, dividendType } = args;

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: securityTokenSymbol,
    });

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

    let dividendsModule;

    switch (dividendType) {
      case DividendModuleTypes.Erc20: {
        dividendsModule = await securityToken.getErc20DividendModule();

        if (dividendsModule) {
          return new this.Erc20DividendsModule({
            address: dividendsModule.address,
            ...constructorData,
          });
        }

        break;
      }
      case DividendModuleTypes.Erc20: {
        dividendsModule = await securityToken.getEtherDividendModule();

        if (dividendsModule) {
          return new this.EthDividendsModule({
            address: dividendsModule.address,
            ...constructorData,
          });
        }

        break;
      }
      default: {
        throw new Error(
          'Invalid dividend module type. Must be "Erc20" or "Eth".'
        );
      }
    }

    return null;
  };

  public getErc20DividendsModule = async (args: { symbol: string }) => {
    return this.getDividendsModule({
      symbol: args.symbol,
      dividendType: DividendModuleTypes.Erc20,
    });
  };

  public getEthDividendsModule = async (args: { symbol: string }) => {
    return this.getDividendsModule({
      symbol: args.symbol,
      dividendType: DividendModuleTypes.Eth,
    });
  };

  public isValidErc20 = async (args: { address: string }) => {
    const { address } = args;
    return this.lowLevel.isValidErc20({ address });
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

  get EthDividendsModule() {
    return this.entities.EthDividendsModule;
  }

  get TaxWithholding() {
    return this.entities.TaxWithholding;
  }
}
