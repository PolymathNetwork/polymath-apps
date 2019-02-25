import { createStandardAction } from 'typesafe-actions';
import { RequestKeys, Fetcher } from '~/types';
import { types } from '@polymathnetwork/new-shared';

const invalidateRequest = createStandardAction('DATA_REQUESTS/INVALIDATE')<{
  requestKey: RequestKeys;
  args?: types.Pojo;
}>();

const cacheData = createStandardAction('DATA_REQUESTS/CACHE')<{
  requestKey: RequestKeys;
  args: types.Pojo;
  fetchedIds: string[];
}>();

/**
 * This action signals the saga in charge of fetching data from the blockchain
 * that a component needs certain data
 */
const requestData = createStandardAction('DATA_REQUESTS/REQUEST')<{
  fetcher: Fetcher;
}>();

const fetchDataStart = createStandardAction('DATA_REQUESTS/FETCH_START')<{
  requestKey: RequestKeys;
  args: types.Pojo;
}>();

const fetchDataFail = createStandardAction('DATA_REQUESTS/FETCH_FAIL')<{
  errorMessage: string;
  requestKey: RequestKeys;
  args: types.Pojo;
}>();

export {
  invalidateRequest,
  cacheData,
  requestData,
  fetchDataStart,
  fetchDataFail,
};
