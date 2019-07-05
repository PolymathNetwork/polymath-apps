import { createCheckpointsBySymbolFetcher } from '../fetchers';
import { Entities, RequestKeys } from '~/types';

describe('fetcher generators', () => {
  test('createCheckpointsBySymbolFetcher should create the required format', () => {
    const args = { symbol: 'TOKEN' };

    expect(createCheckpointsBySymbolFetcher(args)).toEqual({
      entity: Entities.Checkpoints,
      requestKey: RequestKeys.GetCheckpointsBySymbol,
      args,
    });

    const propKey = 'otherCheckpoints';

    expect(createCheckpointsBySymbolFetcher(args, { propKey })).toEqual({
      entity: Entities.Checkpoints,
      requestKey: RequestKeys.GetCheckpointsBySymbol,
      args,
      propKey,
    });
  });
});
