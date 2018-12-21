import { createStandardAction } from 'typesafe-actions';

const invalidateRequest = createStandardAction('DATA_REQUESTS/INVALIDATE')<{
  requestKey: string;
  args?: any[];
}>();

const cacheResponse = createStandardAction('DATA_REQUESTS/CACHE')<{
  requestKey: string;
  args: any[];
  fetchedData: any[];
}>();

export { invalidateRequest, cacheResponse };
