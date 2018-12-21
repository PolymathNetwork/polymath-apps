import { RootState } from '~/state/store';
import { createSelector } from 'reselect';
import { hashObj } from '~/utils';
import _ from 'lodash';
import { Fetcher, Pojo, RequestKeys, FetchedData, CacheStatus } from '~/types';

const appSelector = (state: RootState) => state.app;
const entitiesSelector = (state: RootState) => state.entities;
const dataRequestsSelector = (state: RootState) => state.dataRequests;
const sessionSelector = (state: RootState) => state.session;

interface FetcherProps {
  fetchers: Fetcher[];
}

interface CachedResults {
  cachedIds: string[] | undefined;
  key: string;
  requestKey: RequestKeys;
  args: Pojo;
}

const entityStoresPerFetcherSelector = (
  state: RootState,
  { fetchers }: FetcherProps
) => _.map(fetchers, fetcher => state.entities[fetcher.entity]);

const cachedResultsPerFetcherSelector = (
  state: RootState,
  { fetchers }: FetcherProps
) =>
  _.map<Fetcher, CachedResults>(fetchers, fetcher => {
    const { args, propKey, entity, requestKey } = fetcher;

    const argsHash = hashObj(args);
    const cachedIds = state.dataRequests[requestKey][argsHash];
    const key = propKey || entity;

    return {
      cachedIds,
      key,
      requestKey,
      args,
    };
  });

/**
 * Throws an error if more than one fetcher represents the same request (requestKey and arguments)
 * or if more than one fetcher has the same propKey
 */
const checkFetchersForDuplicates = (
  _state: RootState,
  { fetchers }: FetcherProps
): void => {
  const usedPropKeys: {
    [key: string]: boolean | undefined;
  } = {};

  const usedRequests: {
    [key: string]: boolean | undefined;
  } = {};
  _.forEach(fetchers, fetcher => {
    const { propKey, entity, requestKey } = fetcher;

    const hashedRequest = hashObj({
      requestKey,
      ...fetcher.args,
    });

    if (usedRequests[hashedRequest]) {
      throw new Error(
        'Duplicate fetcher. Make sure you are \
not passing two fetchers with the same `requestKey` and arguments'
      );
    }

    usedRequests[hashedRequest] = true;

    const key = propKey || entity;

    if (usedPropKeys[key]) {
      throw new Error(
        'Cannot override fetched results. \
Make sure to use a different entity name in all of your \
fetchers. You can use `propKey` to override the name of the property that will hold the results.'
      );
    }

    usedPropKeys[key] = true;
  });
};

/**
 * Creates a selector that retrieves cached request data from the store.
 * The result of the selector is an object which contains all the available entities
 * as requested by each fetcher.
 */
const createGetEntitiesFromCache = () =>
  createSelector(
    [
      entityStoresPerFetcherSelector,
      cachedResultsPerFetcherSelector,
      checkFetchersForDuplicates,
    ],
    (entityStores, cachedResults) => {
      const storesWithIds = _.zipWith(
        entityStores,
        cachedResults,
        (store, result) => {
          const { cachedIds, key } = result;
          return { store, cachedIds, key };
        }
      );

      const results: FetchedData = {};

      _.forEach(storesWithIds, data => {
        const { cachedIds, key, store } = data;

        results[key] = _.filter(store.byId, entity =>
          _.includes(cachedIds, entity.id)
        );
      });

      return results;
    }
  );

/**
 * Creates a selector that retrieves the cache status for a group of fetchers.
 * The result of the selector is an array of objects which indicate whether the data
 * associated to a particular request must be fetched again
 */
const createGetCacheStatus = () =>
  createSelector(
    [cachedResultsPerFetcherSelector, checkFetchersForDuplicates],
    cachedResults =>
      _.map<CachedResults, CacheStatus>(cachedResults, result => {
        const { requestKey, args, cachedIds } = result;

        return {
          requestKey,
          args,
          mustBeFetched: !cachedIds,
        };
      })
  );

export {
  appSelector,
  entitiesSelector,
  dataRequestsSelector,
  sessionSelector,
  createGetEntitiesFromCache,
  createGetCacheStatus,
  checkFetchersForDuplicates,
};
