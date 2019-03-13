import { createStandardAction } from 'typesafe-actions';
import { RequestKeys, Fetcher, RequestArgs } from '~/types';

const invalidateRequest = createStandardAction('DATA_REQUESTS/INVALIDATE')<{
  requestKey: RequestKeys;
  args?: RequestArgs;
}>();

const cacheData = createStandardAction('DATA_REQUESTS/CACHE')<{
  requestKey: RequestKeys;
  args: RequestArgs;
  fetchedIds: string[];
}>();

/**
 * This action signals the saga in charge of fetching data from the blockchain
 * that a component needs certain data
 */
const requestData = createStandardAction('DATA_REQUESTS/REQUEST')<{
  fetcher: Fetcher<RequestArgs>;
}>();

const fetchDataStart = createStandardAction('DATA_REQUESTS/FETCH_START')<{
  requestKey: RequestKeys;
  args: RequestArgs;
}>();

const fetchDataFail = createStandardAction('DATA_REQUESTS/FETCH_FAIL')<{
  errorMessage: string;
  requestKey: RequestKeys;
  args: RequestArgs;
}>();

export {
  invalidateRequest,
  cacheData,
  requestData,
  fetchDataStart,
  fetchDataFail,
};
