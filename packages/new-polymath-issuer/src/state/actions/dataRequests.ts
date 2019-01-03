import { createStandardAction } from 'typesafe-actions';
import { RequestKeys, Pojo } from '~/types';

const invalidateRequest = createStandardAction('DATA_REQUESTS/INVALIDATE')<{
  requestKey: RequestKeys;
  args?: Pojo;
}>();

const cacheData = createStandardAction('DATA_REQUESTS/CACHE')<{
  requestKey: RequestKeys;
  args: Pojo;
  fetchedIds: string[];
}>();

const fetchData = createStandardAction('DATA_REQUESTS/FETCH')<{
  requestKey: RequestKeys;
  args: Pojo;
}>();

const fetchDataError = createStandardAction('DATA_REQUESTS/FETCH_ERROR')<
  Error
>();

export { invalidateRequest, cacheData, fetchData, fetchDataError };
