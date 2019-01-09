import {
  appSelector,
  entitiesSelector,
  dataRequestsSelector,
  sessionSelector,
  createGetEntitiesFromCache,
  createGetCacheStatus,
  checkFetchersForDuplicates,
} from '../selectors';
import { RootState } from '~/state/store';
import BigNumber from 'bignumber.js';
import { RequestKeys, Entities, Fetcher } from '~/types';
import { types, utils } from '@polymathnetwork/new-shared';

const requestArgs: types.Pojo[] = [
  { foo: 'Foo', bar: 'Bar' },
  { baz: 'baz' },
  { boris: 'sucks' },
];

const appState = {
  polyClientInitialized: true,
  changingRoute: false,
};

const sessionState = {};

const routerState = {};

const checkpoints = {
  byId: {
    c0: {
      uid: 'c0',
      index: 0,
      securityTokenId: 's0',
      securityTokenSymbol: 'S',
      investorBalances: [],
      totalSupply: new BigNumber('1000000'),
      createdAt: new Date(),
    },
    c1: {
      uid: 'c1',
      index: 2,
      securityTokenId: 's0',
      securityTokenSymbol: 'S',
      investorBalances: [],
      totalSupply: new BigNumber('2000000'),
      createdAt: new Date(),
    },
  },
  allIds: ['c0', 'c1'],
};

const dividends = {
  byId: {
    d0: {
      uid: 'd0',
      index: 0,
      created: new Date(),
      securityTokenId: 's0',
      securityTokenSymbol: 'S',
      checkpointId: 'c0',
      maturity: new Date(),
      expiry: new Date(),
      amount: new BigNumber('10000'),
      claimedAmount: new BigNumber('500'),
      totalSupply: new BigNumber('1000000'),
      reclaimed: false,
      dividendWithheld: new BigNumber('500'),
      dividendWithheldReclaimed: new BigNumber('250'),
      name: 'Dividend0',
      currency: 'POLY',
    },
  },
  allIds: ['d0'],
};

const transactions = {
  byId: {},
  allIds: [],
};

const erc20DividendsModules = {
  byId: {},
  allIds: [],
};

const sequences = {
  byId: {},
  allIds: [],
};

const entitiesState = {
  checkpoints,
  dividends,
  transactions,
  erc20DividendsModules,
  sequences,
};

const dataRequestsState = {
  [RequestKeys.GetCheckpointsBySymbol]: {
    [utils.hashObj(requestArgs[0])]: ['c0'],
    [utils.hashObj(requestArgs[1])]: ['c1'],
    [utils.hashObj(requestArgs[2])]: ['c0', 'c1'],
  },
  [RequestKeys.GetSecurityTokenBySymbol]: {},
  [RequestKeys.GetDividendsByCheckpoint]: {},
  [RequestKeys.GetErc20DividendsModuleBySymbol]: {},
};

const mockState: RootState = {
  session: sessionState,
  router: routerState,
  entities: entitiesState,
  dataRequests: dataRequestsState,
  app: appState,
};

describe('Selectors', () => {
  test('appSelector should return the app state', () => {
    expect(appSelector(mockState)).toEqual(appState);
  });

  test('entitiesSelector should return the entities state', () => {
    expect(entitiesSelector(mockState)).toEqual(entitiesState);
  });

  test('dataRequestsSelector should return the data requests state', () => {
    expect(dataRequestsSelector(mockState)).toEqual(dataRequestsState);
  });

  test('sessionSelector should return the session state', () => {
    expect(sessionSelector(mockState)).toEqual(sessionState);
  });

  const fetcher1: Fetcher = {
    entity: Entities.Checkpoints,
    requestKey: RequestKeys.GetCheckpointsBySymbol,
    args: requestArgs[0],
  };
  const fetcher2: Fetcher = {
    entity: Entities.Checkpoints,
    propKey: 'otherCheckpoints',
    requestKey: RequestKeys.GetCheckpointsBySymbol,
    args: requestArgs[1],
  };
  const fetcher3: Fetcher = {
    entity: Entities.Checkpoints,
    propKey: 'stillOtherCheckpoints',
    requestKey: RequestKeys.GetCheckpointsBySymbol,
    args: requestArgs[2],
  };

  const invalidFetcher1: Fetcher = {
    entity: Entities.Checkpoints,
    propKey: 'moreCheckpoints',
    requestKey: RequestKeys.GetCheckpointsBySymbol,
    args: { invalid: 'These args have not been cached' },
  };

  const invalidFetcher2: Fetcher = {
    entity: Entities.Checkpoints,
    propKey: 'evenMoreCheckpoints',
    requestKey: RequestKeys.GetCheckpointsBySymbol,
    args: { invalid: 'These args have not been cached either' },
  };

  const sameEntityAsFetcher1: Fetcher = {
    entity: Entities.Checkpoints,
    requestKey: RequestKeys.GetCheckpointsBySymbol,
    args: requestArgs[1],
  };

  const samePropKeyAsFetcher2: Fetcher = {
    entity: Entities.Checkpoints,
    propKey: 'otherCheckpoints',
    requestKey: RequestKeys.GetCheckpointsBySymbol,
    args: requestArgs[0],
  };

  const samePropKeyAsFetcher1Entity: Fetcher = {
    entity: Entities.Checkpoints,
    propKey: 'checkpoints',
    requestKey: RequestKeys.GetCheckpointsBySymbol,
    args: requestArgs[1],
  };

  describe('checkFetchersForDuplicates', () => {
    test('should throw an error if more than one fetcher has the same property key (propKey || entity)', () => {
      const expectedErrorMessage =
        'Cannot override fetched results. \
Make sure to use a different entity name in all of your \
fetchers. You can use `propKey` to override the name of the property that will hold the results.';

      expect(() =>
        checkFetchersForDuplicates(mockState, {
          fetchers: [fetcher1, sameEntityAsFetcher1],
        })
      ).toThrowError(expectedErrorMessage);

      expect(() =>
        checkFetchersForDuplicates(mockState, {
          fetchers: [fetcher1, samePropKeyAsFetcher1Entity],
        })
      ).toThrowError(expectedErrorMessage);

      expect(() =>
        checkFetchersForDuplicates(mockState, {
          fetchers: [fetcher2, samePropKeyAsFetcher2],
        })
      ).toThrowError(expectedErrorMessage);
    });

    test('should throw an error if more than one fetcher has the same request key and arguments', () => {
      const expectedErrorMessage =
        'Duplicate fetcher. Make sure you are \
not passing two fetchers with the same `requestKey` and arguments';

      expect(() =>
        checkFetchersForDuplicates(mockState, {
          fetchers: [fetcher1, fetcher1],
        })
      ).toThrowError(expectedErrorMessage);
    });
  });

  describe('Selector creator: createGetEntitiesFromCache', () => {
    test('should return the correct cached entities', () => {
      expect(createGetEntitiesFromCache()(mockState, { fetchers: [] })).toEqual(
        {}
      );

      expect(
        createGetEntitiesFromCache()(mockState, { fetchers: [fetcher1] })
      ).toEqual({
        checkpoints: [checkpoints.byId.c0],
      });

      expect(
        createGetEntitiesFromCache()(mockState, {
          fetchers: [fetcher1, fetcher2, fetcher3],
        })
      ).toEqual({
        checkpoints: [checkpoints.byId.c0],
        otherCheckpoints: [checkpoints.byId.c1],
        stillOtherCheckpoints: [checkpoints.byId.c0, checkpoints.byId.c1],
      });
    });

    test('entity arrays that are not cached should be empty', () => {
      expect(
        createGetEntitiesFromCache()(mockState, {
          fetchers: [invalidFetcher1, invalidFetcher2],
        })
      ).toEqual({
        moreCheckpoints: [],
        evenMoreCheckpoints: [],
      });
    });
  });

  describe('Selector creator: createGetCacheStatus', () => {
    test('should return the correct cache status', () => {
      expect(createGetCacheStatus()(mockState, { fetchers: [] })).toEqual([]);

      expect(
        createGetCacheStatus()(mockState, { fetchers: [fetcher1] })
      ).toEqual([
        {
          requestKey: fetcher1.requestKey,
          args: fetcher1.args,
          mustBeFetched: false,
        },
      ]);

      expect(
        createGetCacheStatus()(mockState, { fetchers: [invalidFetcher1] })
      ).toEqual([
        {
          requestKey: invalidFetcher1.requestKey,
          args: invalidFetcher1.args,
          mustBeFetched: true,
        },
      ]);

      expect(
        createGetCacheStatus()(mockState, {
          fetchers: [fetcher1, invalidFetcher1],
        })
      ).toEqual([
        {
          requestKey: fetcher1.requestKey,
          args: fetcher1.args,
          mustBeFetched: false,
        },
        {
          requestKey: invalidFetcher1.requestKey,
          args: invalidFetcher1.args,
          mustBeFetched: true,
        },
      ]);
    });
  });
});
