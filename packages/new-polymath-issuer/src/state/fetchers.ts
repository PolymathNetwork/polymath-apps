import { Fetcher, Entities, RequestKeys } from '~/types';

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
