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
