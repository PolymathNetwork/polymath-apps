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

  // test('initializePolyClient actions correctly update state', () => {
  //   const startResult = reducer(undefined, actions.initializePolyClientStart());
  //   const successResult = reducer(
  //     startResult,
  //     actions.initializePolyClientSuccess()
  //   );
  //   const failResult = reducer(
  //     startResult,
  //     actions.initializePolyClientFailure(new Error('Some error'))
  //   );
  //   // Not yet finished initializing
  //   expect(startResult.polyClientInitialized).toEqual(false);
  //   expect(successResult.polyClientInitialized).toEqual(true);
  //   expect(failResult.polyClientInitialized).toEqual(false);
  // });

  // test('setChangingRoute sets changingRoute correctly ', () => {
  //   let result = reducer(undefined, actions.setChangingRoute(true));
  //   expect(result.changingRoute).toEqual(true);
  //   result = reducer(undefined, actions.setChangingRoute(false));
  //   expect(result.changingRoute).toEqual(false);
  // });
});
