import { HttpProvider } from 'web3/providers';
import BigNumber from 'bignumber.js';
import { includes, zipWith } from 'lodash';
import { PolyToken } from './LowLevel/PolyToken';
import { LowLevel } from './LowLevel';
import { PolymathRegistry } from './LowLevel/PolymathRegistry';
import { SecurityTokenRegistry } from './LowLevel/SecurityTokenRegistry';
import { SecurityToken } from './LowLevel/SecurityToken';
import { Context } from './Context';
import { ModuleRegistry } from './LowLevel/ModuleRegistry';
import { TaxWithholdingEntry, PolymathNetworkParams, ErrorCodes, ModuleOperations } from './types';
import {
  Dividend as LowLevelDividend,
  Checkpoint as LowLevelCheckpoint,
  DividendModuleTypes,
  StoModuleTypes,
} from './LowLevel/types';
import {
  Dividend as DividendEntity,
  Checkpoint as CheckpointEntity,
  TaxWithholding as TaxWithholdingEntity,
  SecurityToken as SecurityTokenEntity,
  Erc20DividendsModule as Erc20DividendsModuleEntity,
  EthDividendsModule as EthDividendsModuleEntity,
  Erc20TokenBalance as Erc20TokenBalanceEntity,
  SecurityTokenReservation as SecurityTokenReservationEntity,
  CappedStoModule as CappedStoModuleEntity,
  UsdTieredStoModule as UsdTieredStoModuleEntity,
  Investment as InvestmentEntity,
  StoModule as StoModuleEntity,
} from './entities';

import {
  ReserveSecurityToken,
  EnableDividendModules,
  CreateCheckpoint,
  CreateErc20DividendDistribution,
  CreateEtherDividendDistribution,
  UpdateDividendsTaxWithholdingList,
  PushDividendPayment,
  WithdrawTaxes,
  CreateSecurityToken,
  SetDividendsWallet,
  ChangeDelegatePermission,
  EnableGeneralPermissionManager,
  ControllerTransfer,
  PauseSto,
  SetController,
} from './procedures';
import { Entity } from './entities/Entity';
import { DividendsModule } from './entities/DividendsModule';
import { PolymathError } from './PolymathError';

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
  Erc20TokenBalance: typeof Erc20TokenBalanceEntity;
  SecurityTokenReservation: typeof SecurityTokenReservationEntity;
  CappedStoModule: typeof CappedStoModuleEntity;
  UsdTieredStoModule: typeof UsdTieredStoModuleEntity;
  Investment: typeof InvestmentEntity;
  StoModule: typeof StoModuleEntity;
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
      SecurityToken: createContextualizedEntity(SecurityTokenEntity as any, this),
      Erc20DividendsModule: createContextualizedEntity(Erc20DividendsModuleEntity as any, this),
      EthDividendsModule: createContextualizedEntity(EthDividendsModuleEntity as any, this),
      Dividend: createContextualizedEntity(DividendEntity as any, this),
      Checkpoint: createContextualizedEntity(CheckpointEntity as any, this),
      TaxWithholding: createContextualizedEntity(TaxWithholdingEntity as any, this),
      Erc20TokenBalance: createContextualizedEntity(Erc20TokenBalanceEntity as any, this),
      SecurityTokenReservation: createContextualizedEntity(
        SecurityTokenReservationEntity as any,
        this
      ),
      CappedStoModule: createContextualizedEntity(CappedStoModuleEntity as any, this),
      UsdTieredStoModule: createContextualizedEntity(UsdTieredStoModuleEntity as any, this),
      Investment: createContextualizedEntity(InvestmentEntity as any, this),
      StoModule: createContextualizedEntity(StoModuleEntity as any, this),
    };
  }

  public connect = async ({
    polymathRegistryAddress,
    httpProvider,
    httpProviderUrl,
    privateKey,
  }: PolymathNetworkParams) => {
    let lowLevel: LowLevel;

    if (httpProvider) {
      this.httpProvider = httpProvider;
      lowLevel = new LowLevel({ provider: this.httpProvider, privateKey });
    } else if (httpProviderUrl) {
      this.httpProviderUrl = httpProviderUrl;
      lowLevel = new LowLevel({ provider: this.httpProviderUrl, privateKey });
    } else {
      lowLevel = new LowLevel({ privateKey });
    }

    this.lowLevel = lowLevel;
    this.polymathRegistryAddress = polymathRegistryAddress;

    this.networkId = await lowLevel.getNetworkId();
    const account = await lowLevel.getAccount();

    if (!polymathRegistryAddress) {
      throw new Error(`Polymath registry address for network id "${this.networkId}" was not found`);
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
    securityTokenReservationId: string;
    name: string;
    detailsUrl?: string;
    divisible: boolean;
  }) => {
    const { securityTokenReservationId, ...rest } = args;
    const { symbol } = this.SecurityTokenReservation.unserialize(securityTokenReservationId);
    const procedure = new CreateSecurityToken(
      {
        symbol,
        ...rest,
      },
      this.context
    );
    return await procedure.prepare();
  };

  /**
   * Reserve a Security Token
   */
  public reserveSecurityToken = async (args: { symbol: string; name: string }) => {
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
    securityTokenId: string;
    storageWalletAddress: string;
    types?: DividendModuleTypes[];
  }) => {
    const { securityTokenId, ...rest } = args;
    const { symbol } = this.SecurityToken.unserialize(securityTokenId);
    const procedure = new EnableDividendModules(
      {
        symbol,
        ...rest,
      },
      this.context
    );
    return await procedure.prepare();
  };

  /**
   * Enable General Permission Manager module
   *
   * @param securityTokenId token uuid
   */
  public enablePermissionsModule = async (args: { securityTokenId: string }) => {
    const { symbol } = this.SecurityToken.unserialize(args.securityTokenId);
    const procedure = new EnableGeneralPermissionManager(
      {
        symbol,
      },
      this.context
    );
    return await procedure.prepare();
  };

  /**
   * Create investor supply checkpoint at the current date
   */
  public createCheckpoint = async (args: { securityTokenId: string }) => {
    const { securityTokenId, ...rest } = args;
    const { symbol } = this.SecurityToken.unserialize(securityTokenId);
    const procedure = new CreateCheckpoint(
      {
        symbol,
        ...rest,
      },
      this.context
    );
    return await procedure.prepare();
  };

  /**
   * Distribute dividends in POLY
   */
  public createPolyDividendDistribution = async (args: {
    securityTokenId: string;
    checkpointId: string;
    maturityDate: Date;
    expiryDate: Date;
    amount: BigNumber;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholdingEntry[];
  }) => {
    const polyAddress = this.context.polyToken.address;
    const { securityTokenId, checkpointId, ...rest } = args;
    const { symbol } = this.SecurityToken.unserialize(securityTokenId);
    const { index: checkpointIndex } = this.Checkpoint.unserialize(checkpointId);
    const procedure = new CreateErc20DividendDistribution(
      {
        erc20Address: polyAddress,
        symbol,
        checkpointIndex,
        ...rest,
      },
      this.context
    );

    return await procedure.prepare();
  };

  /**
   * Distribute dividends in a specified ERC20 token
   */
  public createErc20DividendDistribution = async (args: {
    securityTokenId: string;
    checkpointId: string;
    maturityDate: Date;
    expiryDate: Date;
    erc20Address: string;
    amount: BigNumber;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholdingEntry[];
  }) => {
    const { securityTokenId, checkpointId, ...rest } = args;
    const { symbol } = this.SecurityToken.unserialize(securityTokenId);
    const { index: checkpointIndex } = this.Checkpoint.unserialize(checkpointId);
    const procedure = new CreateErc20DividendDistribution(
      {
        symbol,
        checkpointIndex,
        ...rest,
      },
      this.context
    );
    return await procedure.prepare();
  };

  /**
   * Distribute dividends in ETH
   */
  public createEthDividendDistribution = async (args: {
    securityTokenId: string;
    checkpointId: string;
    maturityDate: Date;
    expiryDate: Date;
    erc20Address: string;
    amount: BigNumber;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholdingEntry[];
  }) => {
    const { securityTokenId, checkpointId, ...rest } = args;
    const { symbol } = this.SecurityToken.unserialize(securityTokenId);
    const { index: checkpointIndex } = this.Checkpoint.unserialize(checkpointId);
    const procedure = new CreateEtherDividendDistribution(
      {
        symbol,
        checkpointIndex,
        ...rest,
      },
      this.context
    );
    return await procedure.prepare();
  };

  /**
   * Set tax withtholding list for a type of dividends
   */
  public updateDividendsTaxWithholdingList = async (args: {
    securityTokenId: string;
    dividendType: DividendModuleTypes;
    investorAddresses: string[];
    percentages: number[];
  }) => {
    const { securityTokenId, ...rest } = args;
    const { symbol } = this.SecurityToken.unserialize(securityTokenId);
    const procedure = new UpdateDividendsTaxWithholdingList(
      {
        symbol,
        ...rest,
      },
      this.context
    );
    return await procedure.prepare();
  };

  /**
   * Push dividends payments for a dividend distribution
   */
  public pushDividendPayment = async (args: {
    securityTokenId: string;
    dividendType: DividendModuleTypes;
    dividendIndex: number;
  }) => {
    const { securityTokenId, ...rest } = args;
    const { symbol } = this.SecurityToken.unserialize(securityTokenId);
    const procedure = new PushDividendPayment(
      {
        symbol,
        ...rest,
      },
      this.context
    );
    return await procedure.prepare();
  };

  /**
   * Change dividends module reclaiming wallet address
   */
  public setDividendsWallet = async (args: {
    securityTokenId: string;
    dividendType: DividendModuleTypes;
    address: string;
  }) => {
    const { securityTokenId, ...rest } = args;
    const { symbol } = this.SecurityToken.unserialize(securityTokenId);
    const procedure = new SetDividendsWallet(
      {
        symbol,
        ...rest,
      },
      this.context
    );
    return await procedure.prepare();
  };

  /**
   * Withdraw taxes from a dividend distribution
   */
  public withdrawTaxes = async (args: {
    securityTokenId: string;
    dividendType: DividendModuleTypes;
    dividendIndex: number;
  }) => {
    const { securityTokenId, ...rest } = args;
    const { symbol } = this.SecurityToken.unserialize(securityTokenId);
    const procedure = new WithdrawTaxes(
      {
        symbol,
        ...rest,
      },
      this.context
    );
    return await procedure.prepare();
  };

  /**
   * Grant or revoke permission to a delegate address
   */
  public changeDelegatePermission = async (args: {
    securityTokenId: string;
    delegate: string;
    op: ModuleOperations;
    isGranted: boolean;
    details?: string;
  }) => {
    const { securityTokenId, delegate, op, isGranted, details } = args;
    const { symbol } = this.SecurityToken.unserialize(securityTokenId);

    const procedure = new ChangeDelegatePermission(
      { symbol, delegate, op, isGranted, details },
      this.context
    );

    return await procedure.prepare();
  };

  public controllerTransfer = async (args: {
    securityTokenId: string;
    value: BigNumber;
    from: string;
    to: string;
    reason?: string;
    data?: string;
  }) => {
    const { securityTokenId, value, from, to, reason: reason = '', data: data = '' } = args;
    const { symbol } = this.SecurityToken.unserialize(securityTokenId);

    const procedure = new ControllerTransfer(
      { symbol, value, from, to, log: reason, data },
      this.context
    );

    return await procedure.prepare();
  };

  public setTokenController = async (args: { securityTokenId: string; controller: string }) => {
    const { securityTokenId, controller } = args;
    const { symbol } = this.SecurityToken.unserialize(securityTokenId);
    const procedure = new SetController({ symbol, controller }, this.context);

    return await procedure.prepare();
  };

  public pauseSto = async (args: { stoModuleId: string }) => {
    const { stoModuleId } = args;
    const { securityTokenId, address } = this.StoModule.unserialize(stoModuleId);
    const { symbol } = this.SecurityToken.unserialize(securityTokenId);

    const procedure = new PauseSto({ symbol, stoModuleAddress: address }, this.context);

    return await procedure.prepare();
  };

  /**
   * Retrieve a security token
   */
  public getSecurityToken = async (
    args:
      | {
          symbol: string;
        }
      | string
  ) => {
    const { securityTokenRegistry } = this.context;

    let symbol: string;

    // fetch by UUID
    if (typeof args === 'string') {
      ({ symbol } = this.SecurityToken.unserialize(args));
    } else {
      ({ symbol } = args);
    }

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });

    if (!securityToken) {
      throw new PolymathError({
        code: ErrorCodes.FetcherValidationError,
        message: `There is no Security Token with symbol ${symbol}`,
      });
    }

    const name = await securityToken.name();
    const owner = await securityToken.owner();
    const { address } = securityToken;

    return new this.SecurityToken({
      name,
      address,
      symbol,
      owner,
    });
  };

  /**
   * Retrieve a list of investor addresses and their corresponding tax withholding
   * percentages
   */
  public getDividendsTaxWithholdingList = async (
    args:
      | {
          securityTokenId: string;
          checkpointId: string;
          dividendType: DividendModuleTypes;
        }
      | string
  ) => {
    const { securityTokenRegistry } = this.context;

    let securityTokenId: string;
    let checkpointId: string;
    let dividendType: DividendModuleTypes;

    // fetch by UUID
    if (typeof args === 'string') {
      ({ securityTokenId, dividendType, checkpointId } = this.TaxWithholding.unserialize(args));
    } else {
      ({ securityTokenId, dividendType, checkpointId } = args);
    }

    const { symbol } = this.SecurityToken.unserialize(securityTokenId);

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });

    if (!securityToken) {
      throw new PolymathError({
        code: ErrorCodes.FetcherValidationError,
        message: `There is no Security Token with symbol ${symbol}`,
      });
    }

    let dividendsModule;
    if (dividendType === DividendModuleTypes.Erc20) {
      dividendsModule = await securityToken.getErc20DividendModule();
    } else if (dividendType === DividendModuleTypes.Eth) {
      dividendsModule = await securityToken.getEtherDividendModule();
    }

    if (!dividendsModule) {
      throw new Error('There is no attached dividend module of the specified type');
    }

    const { index: checkpointIndex } = this.Checkpoint.unserialize(checkpointId);

    const taxWithholdings = await dividendsModule.getTaxWithholdingList({
      checkpointIndex,
    });

    return taxWithholdings.map(
      ({ address: investorAddress, percentage }) =>
        new this.TaxWithholding({
          investorAddress,
          percentage,
          securityTokenSymbol: symbol,
          checkpointId,
          securityTokenId,
          dividendType,
          checkpointIndex,
        })
    );
  };

  /**
   * Retrieve list of checkpoints and their corresponding dividends
   *
   * @param dividendTypes array of dividend types that should be returned. Default value is both
   */
  public getCheckpoints = async (
    args: {
      securityTokenId: string;
    },
    opts?: { dividendTypes?: DividendModuleTypes[] }
  ): Promise<CheckpointEntity[]> => {
    const { securityTokenRegistry } = this.context;
    const { securityTokenId } = args;

    const { symbol } = this.SecurityToken.unserialize(securityTokenId);

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });

    if (!securityToken) {
      throw new PolymathError({
        code: ErrorCodes.FetcherValidationError,
        message: `There is no Security Token with symbol ${symbol}`,
      });
    }

    let dividendTypes: DividendModuleTypes[] | undefined;

    if (opts) {
      ({ dividendTypes } = opts);
    }

    const allDividends = await this.getAllDividends({
      securityToken,
      dividendTypes,
    });

    const checkpoints: LowLevelCheckpoint[] = await securityToken.getCheckpoints();

    return checkpoints.map(checkpoint => {
      const checkpointDividends = allDividends.filter(
        dividend => dividend.checkpointId === checkpoint.index
      );

      return this.assembleCheckpoint({
        securityTokenId,
        securityTokenSymbol: symbol,
        checkpoint,
        checkpointDividends,
      });
    });
  };

  /**
   * Retrieve a checkpoint from a security token
   */
  public getCheckpoint = async (
    args:
      | {
          securityTokenId: string;
          checkpointIndex: number;
        }
      | string,
    opts?: { dividendTypes?: DividendModuleTypes[] }
  ) => {
    const { securityTokenRegistry } = this.context;

    let securityTokenId: string;
    let checkpointIndex: number;

    // fetch by UUID
    if (typeof args === 'string') {
      ({ securityTokenId, index: checkpointIndex } = this.Checkpoint.unserialize(args));
    } else {
      ({ securityTokenId, checkpointIndex } = args);
    }

    let dividendTypes: DividendModuleTypes[] | undefined;

    if (opts) {
      ({ dividendTypes } = opts);
    }

    const { symbol: securityTokenSymbol } = this.SecurityToken.unserialize(securityTokenId);

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: securityTokenSymbol,
    });

    if (!securityToken) {
      throw new PolymathError({
        code: ErrorCodes.FetcherValidationError,
        message: `There is no Security Token with symbol ${securityTokenSymbol}`,
      });
    }

    const checkpointDividends = await this.getAllDividends({
      securityToken,
      checkpointIndex,
      dividendTypes,
    });

    const checkpoint: LowLevelCheckpoint = await securityToken.getCheckpoint({
      checkpointId: checkpointIndex,
    });

    return this.assembleCheckpoint({
      securityTokenId,
      securityTokenSymbol,
      checkpoint,
      checkpointDividends,
    });
  };

  /**
   * Retrieve all dividend distributions at a certain checkpoint
   */
  public getDividends = async (
    args: {
      securityTokenId: string;
      checkpointId: string;
    },
    opts?: { dividendTypes?: DividendModuleTypes[] }
  ) => {
    const { securityTokenRegistry } = this.context;
    const { securityTokenId, checkpointId } = args;

    const { symbol } = this.SecurityToken.unserialize(securityTokenId);

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });

    if (!securityToken) {
      throw new PolymathError({
        code: ErrorCodes.FetcherValidationError,
        message: `There is no Security Token with symbol ${symbol}`,
      });
    }

    const { index: checkpointIndex } = this.Checkpoint.unserialize(checkpointId);

    let dividendTypes: DividendModuleTypes[] | undefined;

    if (opts) {
      ({ dividendTypes } = opts);
    }

    const checkpointDividends = await this.getAllDividends({
      securityToken,
      checkpointIndex,
      dividendTypes,
    });

    const dividends = checkpointDividends.map(
      dividend =>
        new this.Dividend({
          ...dividend,
          checkpointId,
          securityTokenSymbol: symbol,
          securityTokenId,
        })
    );

    return dividends;
  };

  /**
   * Retrieve a particular dividend distribution at a certain checkpoint
   */
  public getDividend = async (
    args:
      | {
          securityTokenId: string;
          dividendType: DividendModuleTypes;
          dividendIndex: number;
        }
      | string
  ) => {
    let securityTokenId: string;
    let dividendType: DividendModuleTypes;
    let dividendIndex: number;

    // fetch by UUID
    if (typeof args === 'string') {
      ({ securityTokenId, index: dividendIndex, dividendType } = this.Dividend.unserialize(args));
    } else {
      ({ securityTokenId, dividendType, dividendIndex } = args);
    }

    const checkpoints = await this.getCheckpoints(
      {
        securityTokenId,
      },
      {
        dividendTypes: [dividendType],
      }
    );

    for (const checkpoint of checkpoints) {
      const { dividends } = checkpoint;

      const result = dividends.find(dividend => dividend.index === dividendIndex);

      if (result) {
        return result;
      }
    }

    throw new Error('There is no dividend of the specified type with that index.');
  };

  /**
   * Retrieve all STO modules attached to a security token
   */
  public getStoModules = async (
    args: {
      securityTokenId: string;
    },
    opts: {
      stoModuleTypes: StoModuleTypes[];
    } = {
      stoModuleTypes: [StoModuleTypes.Capped, StoModuleTypes.UsdTiered],
    }
  ) => {
    const { securityTokenRegistry } = this.context;

    const { securityTokenId } = args;

    const { symbol: securityTokenSymbol } = this.SecurityToken.unserialize(securityTokenId);

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: securityTokenSymbol,
    });

    if (!securityToken) {
      throw new PolymathError({
        code: ErrorCodes.FetcherValidationError,
        message: `There is no Security Token with symbol ${securityTokenSymbol}`,
      });
    }

    const constructorData = {
      securityTokenSymbol,
      securityTokenId,
    };

    const { stoModuleTypes } = opts;

    const stoModules = [];

    for (const stoType of stoModuleTypes) {
      let fetchedModules;
      if (stoType === StoModuleTypes.Capped) {
        fetchedModules = await securityToken.getCappedStoModules();

        for (const module of fetchedModules) {
          const details = await module.getDetails();
          const investments = await module.getInvestments();
          const { address } = module;
          const paused = await module.paused();
          const capReached = await module.capReached();
          const stoModuleId = this.CappedStoModule.generateId({
            securityTokenId,
            stoType,
            address,
          });
          const investmentEntities = investments.map(
            investment => new this.Investment({ ...investment, ...constructorData, stoModuleId })
          );

          stoModules.push(
            new this.CappedStoModule({
              ...details,
              ...constructorData,
              investments: investmentEntities,
              stoType,
              address,
              paused,
              capReached,
            })
          );
        }
      } else if (stoType === StoModuleTypes.UsdTiered) {
        fetchedModules = await securityToken.getUsdTieredStoModules();

        for (const module of fetchedModules) {
          const { tokensPerTier, ratesPerTier, ...details } = await module.getDetails();
          const investments = await module.getInvestments();
          const { address } = module;
          const paused = await module.paused();
          const capReached = await module.capReached();
          const stoModuleId = this.UsdTieredStoModule.generateId({
            securityTokenId,
            stoType,
            address,
          });
          const investmentEntities = investments.map(
            investment => new this.Investment({ ...investment, ...constructorData, stoModuleId })
          );

          const tiers = zipWith(tokensPerTier, ratesPerTier, (cap, rate) => ({ cap, rate }));

          stoModules.push(
            new this.UsdTieredStoModule({
              ...details,
              ...constructorData,
              tiers,
              investments: investmentEntities,
              stoType,
              address,
              paused,
              capReached,
            })
          );
        }
      } else {
        throw new PolymathError({
          message: `Invalid STO module type ${stoType} requested.`,
          code: ErrorCodes.FetcherValidationError,
        });
      }
    }

    return stoModules;
  };

  /**
   * Retrieve a dividends module attached to a security token
   */
  public getDividendsModule = async (
    args:
      | {
          securityTokenId: string;
          dividendType: DividendModuleTypes;
        }
      | string
  ) => {
    const { securityTokenRegistry } = this.context;

    let securityTokenId: string;
    let dividendType: DividendModuleTypes;

    // fetch by UUID
    if (typeof args === 'string') {
      ({ securityTokenId, dividendType } = DividendsModule.unserialize(args));
    } else {
      ({ securityTokenId, dividendType } = args);
    }

    const { symbol } = this.SecurityToken.unserialize(securityTokenId);

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });

    if (!securityToken) {
      throw new PolymathError({
        code: ErrorCodes.FetcherValidationError,
        message: `There is no Security Token with symbol ${symbol}`,
      });
    }

    const constructorData = {
      securityTokenSymbol: symbol,
      securityTokenId,
    };

    let dividendsModule;

    switch (dividendType) {
      case DividendModuleTypes.Erc20: {
        dividendsModule = await securityToken.getErc20DividendModule();

        if (dividendsModule) {
          const storageWalletAddress = await dividendsModule.getStorageWallet();
          return new this.Erc20DividendsModule({
            address: dividendsModule.address,
            storageWalletAddress,
            ...constructorData,
          });
        }

        break;
      }
      case DividendModuleTypes.Erc20: {
        dividendsModule = await securityToken.getEtherDividendModule();

        if (dividendsModule) {
          const storageWalletAddress = await dividendsModule.getStorageWallet();
          return new this.EthDividendsModule({
            address: dividendsModule.address,
            storageWalletAddress,
            ...constructorData,
          });
        }

        break;
      }
      default: {
        throw new Error('Invalid dividend module type. Must be "Erc20" or "Eth".');
      }
    }

    return null;
  };

  /**
   * Retrieve the ERC20 dividends module attached to a security token
   */
  public getErc20DividendsModule = async (args: { securityTokenId: string } | string) => {
    // fetch by UUID
    if (typeof args === 'string') {
      return this.getDividendsModule(args);
    }

    return this.getDividendsModule({
      securityTokenId: args.securityTokenId,
      dividendType: DividendModuleTypes.Erc20,
    });
  };

  /**
   * Retrieve the ETH dividends module attached to a security token
   */
  public getEthDividendsModule = async (args: { securityTokenId: string } | string) => {
    // fetch by UUID
    if (typeof args === 'string') {
      return this.getDividendsModule(args);
    }

    return this.getDividendsModule({
      securityTokenId: args.securityTokenId,
      dividendType: DividendModuleTypes.Eth,
    });
  };

  /**
   * Check if a token follows the ERC20 standard
   */
  public isValidErc20 = async (args: { address: string }) => {
    const { address } = args;
    return this.lowLevel.isValidErc20({ address });
  };

  public getErc20TokenBalance = async (
    args:
      | {
          tokenAddress: string;
          walletAddress: string;
        }
      | string
  ) => {
    let tokenAddress: string;
    let walletAddress: string;

    // fetch by UUID
    if (typeof args === 'string') {
      ({ tokenAddress, walletAddress } = this.Erc20TokenBalance.unserialize(args));
    } else {
      ({ tokenAddress, walletAddress } = args);
    }

    const token = await this.lowLevel.getErc20Token({ address: tokenAddress });
    const [symbol, balance] = await Promise.all([
      token.symbol(),
      token.balanceOf({ address: walletAddress }),
    ]);

    return new this.Erc20TokenBalance({
      tokenSymbol: symbol,
      tokenAddress,
      balance,
      walletAddress,
    });
  };

  public getLatestProtocolVersion = async () => {
    return await this.context.securityTokenRegistry.getLatestProtocolVersion();
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

  get Erc20TokenBalance() {
    return this.entities.Erc20TokenBalance;
  }

  get SecurityTokenReservation() {
    return this.entities.SecurityTokenReservation;
  }

  get CappedStoModule() {
    return this.entities.CappedStoModule;
  }

  get UsdTieredStoModule() {
    return this.entities.UsdTieredStoModule;
  }

  get Investment() {
    return this.entities.Investment;
  }

  get StoModule() {
    return this.entities.StoModule;
  }

  /**
   * Auxiliary function to create a checkpoint entity
   */
  private assembleCheckpoint = ({
    securityTokenId,
    securityTokenSymbol,
    checkpoint,
    checkpointDividends,
  }: {
    securityTokenId: string;
    securityTokenSymbol: string;
    checkpoint: LowLevelCheckpoint;
    checkpointDividends: LowLevelDividend[];
  }) => {
    const checkpointId = this.Checkpoint.generateId({
      securityTokenId,
      index: checkpoint.index,
    });

    const dividends = checkpointDividends.map(
      dividend =>
        new this.Dividend({
          ...dividend,
          checkpointId,
          securityTokenSymbol,
          securityTokenId,
        })
    );

    const checkpointEntity = new this.Checkpoint({
      ...checkpoint,
      securityTokenId,
      securityTokenSymbol,
      dividends,
    });

    return checkpointEntity;
  };

  /**
   * Auxiliary function to fetch all dividend distributions
   */
  private getAllDividends = async ({
    securityToken,
    checkpointIndex,
    dividendTypes = [DividendModuleTypes.Erc20, DividendModuleTypes.Eth],
  }: {
    securityToken: SecurityToken;
    checkpointIndex?: number;
    dividendTypes?: DividendModuleTypes[];
  }) => {
    const dividends = [];

    if (includes(dividendTypes, DividendModuleTypes.Erc20)) {
      const erc20Module = await securityToken.getErc20DividendModule();

      if (erc20Module) {
        const erc20Dividends = await (checkpointIndex !== undefined
          ? erc20Module.getDividendsByCheckpoint({ checkpointIndex })
          : erc20Module.getDividends());
        dividends.push(...erc20Dividends);
      }
    }

    if (includes(dividendTypes, DividendModuleTypes.Eth)) {
      const etherModule = await securityToken.getEtherDividendModule();

      if (etherModule) {
        const etherDividends = await (checkpointIndex !== undefined
          ? etherModule.getDividendsByCheckpoint({ checkpointIndex })
          : etherModule.getDividends());
        dividends.push(...etherDividends);
      }
    }

    return dividends;
  };
}
