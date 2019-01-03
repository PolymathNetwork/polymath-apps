import { createStandardAction } from 'typesafe-actions';
import { RequestKeys } from '~/types';
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

const fetchData = createStandardAction('DATA_REQUESTS/FETCH')<{
  requestKey: RequestKeys;
  args: types.Pojo;
}>();

const fetchDataFail = createStandardAction('DATA_REQUESTS/FETCH_FAIL')<Error>();

const fetchDataSuccess = createStandardAction('DATA_REQUESTS/FETCH_SUCCESS')();

export {
  invalidateRequest,
  cacheData,
  fetchData,
  fetchDataFail,
  fetchDataSuccess,
};
