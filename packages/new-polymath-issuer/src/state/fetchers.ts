import { Fetcher, Entities, RequestKeys } from '~/types';
import { DividendModuleTypes } from '@polymathnetwork/sdk';

export const createCheckpointsBySymbolFetcher = (
  args: { securityTokenSymbol: string },
  opts: { propKey?: string } = {}
): Fetcher => {
  return {
    propKey: opts.propKey,
    entity: Entities.Checkpoints,
    requestKey: RequestKeys.GetCheckpointsBySymbol,
    args,
  };
};

export const createCheckpointBySymbolAndIdFetcher = (
  args: { securityTokenSymbol: string; checkpointIndex: number },
  opts: { propKey?: string } = {}
): Fetcher => {
  return {
    propKey: opts.propKey,
    entity: Entities.Checkpoints,
    requestKey: RequestKeys.GetCheckpointBySymbolAndId,
    args,
  };
};

export const createDividendsByCheckpointFetcher = (
  args: { securityTokenSymbol: string; checkpointIndex: number },
  opts: { propKey?: string } = {}
): Fetcher => {
  return {
    propKey: opts.propKey,
    entity: Entities.Dividends,
    requestKey: RequestKeys.GetDividendsByCheckpoint,
    args,
  };
};

export const createErc20DividendsModuleBySymbolFetcher = (
  args: { securityTokenSymbol: string },
  opts: { propKey?: string } = {}
): Fetcher => {
  return {
    propKey: opts.propKey,
    entity: Entities.Erc20DividendsModules,
    requestKey: RequestKeys.GetErc20DividendsModuleBySymbol,
    args,
  };
};

export const createTaxWithholdingListBySymbolFetcher = (
  args: { securityTokenSymbol: string; dividendType: DividendModuleTypes },
  opts: { propKey?: string } = {}
): Fetcher => {
  return {
    propKey: opts.propKey,
    entity: Entities.TaxWithholdings,
    requestKey: RequestKeys.GetTaxWithholdingListBySymbol,
    args,
  };
};

export const createDividendBySymbolAndIdFetcher = (
  args: {
    securityTokenSymbol: string;
    dividendIndex: number;
    dividendType: DividendModuleTypes;
  },
  opts: { propKey?: string } = {}
): Fetcher => {
  return {
    propKey: opts.propKey,
    entity: Entities.Dividends,
    requestKey: RequestKeys.GetDividendBySymbolAndId,
    args,
  };
};
