import { RootState } from '~/state/store';
import { createSelector } from 'reselect';
import { filter, zipWith, forEach, includes } from 'lodash';
import { Fetcher, RequestKeys, FetchedData, CacheStatus } from '~/types';
import { types, utils } from '@polymathnetwork/new-shared';

const appSelector = (state: RootState) => state.app;
const entitiesSelector = (state: RootState) => state.entities;
const dataRequestsSelector = (state: RootState) => state.dataRequests;
const sessionSelector = (state: RootState) => state.session;

const activeTransactionQueueIdSelector = createSelector(
  appSelector,
  app => app.activeTransactionQueue
);

const transactionQueuesSelector = createSelector(
  entitiesSelector,
  entities => entities.transactionQueues
);

const transactionsSelector = createSelector(
  entitiesSelector,
  entities => entities.transactions
);

interface FetcherProps {
  fetchers: Fetcher[];
}

interface CachedResults {
  cachedIds: string[] | undefined;
  key: string;
  requestKey: RequestKeys;
  args: types.Pojo;
}

const entityStoresPerFetcherSelector = (
  state: RootState,
  { fetchers }: FetcherProps
) => fetchers.map(fetcher => state.entities[fetcher.entity]);

const cachedResultsPerFetcherSelector = (
  state: RootState,
  { fetchers }: FetcherProps
) =>
  fetchers.map<CachedResults>(fetcher => {
    const { args, propKey, entity, requestKey } = fetcher;

    const argsHash = utils.hashObj(args);
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
  fetchers.forEach(fetcher => {
    const { propKey, entity, requestKey } = fetcher;

    const hashedRequest = utils.hashObj({
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
      const storesWithIds = zipWith(
        entityStores,
        cachedResults,
        (store, result) => {
          const { cachedIds, key } = result;
          return { store, cachedIds, key };
        }
      );

      const results: FetchedData = {};

      forEach(storesWithIds, data => {
        const { cachedIds, key, store } = data;

        // NOTE @monitz87: this double type assertion is required because
        // of typescript limitations with the index signature
        results[key] = filter(store.byId, entity =>
          includes(cachedIds, entity!.uid)
        ) as types.Entity[];
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
      cachedResults.map<CacheStatus>(result => {
        const { requestKey, args, cachedIds } = result;

        return {
          requestKey,
          args,
          mustBeFetched: !cachedIds,
        };
      })
  );

/**
 * Creates a selector that retrieves the active transaction queue and
 * all of its associated transactions
 */
const createGetActiveTransactionQueue = () =>
  createSelector(
    [
      transactionQueuesSelector,
      transactionsSelector,
      activeTransactionQueueIdSelector,
    ],
    (transactionQueues, transactions, activeTransactionQueueId) => {
      if (!activeTransactionQueueId) {
        return null;
      }

      const {
        byId: { [activeTransactionQueueId]: activeTransactionQueue },
      } = transactionQueues;

      if (!activeTransactionQueue) {
        throw new Error(
          'Invalid state. There is an active transaction queue id but no corresponding transaction queue entity.'
        );
      }

      const activeTransactions = filter(
        transactions.byId,
        transaction =>
          transaction!.transactionQueueUid === activeTransactionQueueId
      ) as types.TransactionEntity[];

      if (activeTransactions.length === 0) {
        throw new Error(
          'Invalid state. There is an active transaction queue but no corresponding transaction entities.'
        );
      }

      return {
        ...activeTransactionQueue,
        transactions: [...activeTransactions],
      };
    }
  );

export {
  appSelector,
  entitiesSelector,
  dataRequestsSelector,
  sessionSelector,
  activeTransactionQueueIdSelector,
  transactionsSelector,
  transactionQueuesSelector,
  createGetEntitiesFromCache,
  createGetCacheStatus,
  createGetActiveTransactionQueue,
  checkFetchersForDuplicates,
};
