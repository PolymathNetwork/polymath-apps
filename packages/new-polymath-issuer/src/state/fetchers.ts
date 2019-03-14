import {
  Fetcher,
  Entities,
  RequestKeys,
  GetCheckpointBySymbolAndIdArgs,
  GetDividendsByCheckpointArgs,
  GetDividendBySymbolAndIdArgs,
  GetErc20DividendsModuleBySymbolArgs,
  GetCheckpointsBySymbolArgs,
  GetTaxWithholdingListBySymbolArgs,
  GetErc20BalanceByAddressAndWalletArgs,
} from '~/types';

export const createCheckpointsBySymbolFetcher = (
  args: GetCheckpointsBySymbolArgs,
  opts: { propKey?: string } = {}
): Fetcher<GetCheckpointsBySymbolArgs> => {
  return {
    propKey: opts.propKey,
    entity: Entities.Checkpoints,
    requestKey: RequestKeys.GetCheckpointsBySymbol,
    args,
  };
};

export const createCheckpointBySymbolAndIdFetcher = (
  args: GetCheckpointBySymbolAndIdArgs,
  opts: { propKey?: string } = {}
): Fetcher<GetCheckpointBySymbolAndIdArgs> => {
  return {
    propKey: opts.propKey,
    entity: Entities.Checkpoints,
    requestKey: RequestKeys.GetCheckpointBySymbolAndId,
    args,
  };
};

export const createDividendsByCheckpointFetcher = (
  args: GetDividendsByCheckpointArgs,
  opts: { propKey?: string } = {}
): Fetcher<GetDividendsByCheckpointArgs> => {
  return {
    propKey: opts.propKey,
    entity: Entities.Dividends,
    requestKey: RequestKeys.GetDividendsByCheckpoint,
    args,
  };
};

export const createErc20DividendsModuleBySymbolFetcher = (
  args: GetErc20DividendsModuleBySymbolArgs,
  opts: { propKey?: string } = {}
): Fetcher<GetErc20DividendsModuleBySymbolArgs> => {
  return {
    propKey: opts.propKey,
    entity: Entities.Erc20DividendsModules,
    requestKey: RequestKeys.GetErc20DividendsModuleBySymbol,
    args,
  };
};

export const createTaxWithholdingListBySymbolFetcher = (
  args: GetTaxWithholdingListBySymbolArgs,
  opts: { propKey?: string } = {}
): Fetcher<GetTaxWithholdingListBySymbolArgs> => {
  return {
    propKey: opts.propKey,
    entity: Entities.TaxWithholdings,
    requestKey: RequestKeys.GetTaxWithholdingListBySymbol,
    args,
  };
};

export const createDividendBySymbolAndIdFetcher = (
  args: GetDividendBySymbolAndIdArgs,
  opts: { propKey?: string } = {}
): Fetcher<GetDividendBySymbolAndIdArgs> => {
  return {
    propKey: opts.propKey,
    entity: Entities.Dividends,
    requestKey: RequestKeys.GetDividendBySymbolAndId,
    args,
  };
};

export const createErc20TokenBalanceByAddressAndWalletFetcher = (
  args: GetErc20BalanceByAddressAndWalletArgs,
  opts: { propKey?: string } = {}
): Fetcher<GetErc20BalanceByAddressAndWalletArgs> => {
  return {
    propKey: opts.propKey,
    entity: Entities.Erc20TokenBalances,
    requestKey: RequestKeys.GetErc20BalanceByAddressAndWallet,
    args,
  };
};
