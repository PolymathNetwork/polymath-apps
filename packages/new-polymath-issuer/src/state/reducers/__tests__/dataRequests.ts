import { reducer } from '../dataRequests';
import * as actions from '~/state/actions/dataRequests';
import { RequestKeys } from '~/types';
import { utils } from '@polymathnetwork/new-shared';

describe('Reducer: dataRequests', () => {
  test('initialState', () => {
    expect(reducer(undefined, {} as any)).toMatchSnapshot();
  });

  const args = {
    foo: 'Foo',
    bar: 'Bar',
  };
  const fetchedIds = ['0', '1', '2'];
  const argsHash = utils.hashObj(args);

  const state = {
    [RequestKeys.GetCheckpointsBySymbol]: {
      [argsHash]: fetchedIds,
    },
    [RequestKeys.GetSecurityTokenBySymbol]: {},
    [RequestKeys.GetDividendsByCheckpoint]: {},
    [RequestKeys.GetErc20DividendsModuleBySymbol]: {},
  };

  test('invalidateRequest invalidates cache for all requests of a certain type', () => {
    const result = reducer(
      state,
      actions.invalidateRequest({
        requestKey: RequestKeys.GetCheckpointsBySymbol,
      })
    );
    expect(result[RequestKeys.GetCheckpointsBySymbol]).toEqual({});
  });

  test('invalidateRequest invalidates cache for a request with a specific set of arguments', () => {
    const result = reducer(
      state,
      actions.invalidateRequest({
        requestKey: RequestKeys.GetCheckpointsBySymbol,
        args,
      })
    );
    expect(
      result[RequestKeys.GetCheckpointsBySymbol][argsHash]
    ).toBeUndefined();
  });

  test('cacheData creates a cache entry', () => {
    const result = reducer(
      undefined,
      actions.cacheData({
        requestKey: RequestKeys.GetCheckpointsBySymbol,
        args,
        fetchedIds,
      })
    );

    expect(result[RequestKeys.GetCheckpointsBySymbol][argsHash]).toEqual(
      fetchedIds
    );
  });
});
