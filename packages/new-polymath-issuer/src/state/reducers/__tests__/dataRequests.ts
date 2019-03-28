import { utils } from '@polymathnetwork/new-shared';
import * as actions from '~/state/actions/dataRequests';
import { RequestKeys } from '~/types';
import { reducer } from '../dataRequests';

describe('Reducer: dataRequests', () => {
  test('initialState', () => {
    expect(reducer(undefined, {} as any)).toMatchSnapshot();
  });

  const args = {
    securityTokenSymbol: 'FOO',
  };
  const fetchedIds = ['0', '1', '2'];
  const argsHash = utils.hashObj(args);

  const state = {
    [RequestKeys.GetCheckpointsBySymbol]: {
      [argsHash]: { fetchedIds, fetching: false },
    },
    [RequestKeys.GetCheckpointBySymbolAndId]: {},
    [RequestKeys.GetSecurityTokenBySymbol]: {},
    [RequestKeys.GetDividendsByCheckpoint]: {},
    [RequestKeys.GetErc20DividendsModuleBySymbol]: {},
    [RequestKeys.GetTaxWithholdingListBySymbolAndCheckpoint]: {},
    [RequestKeys.GetDividendBySymbolAndId]: {},
    [RequestKeys.GetErc20BalanceByAddressAndWallet]: {},
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

  test('fetchDataStart creates a cache entry with fetching set to true', () => {
    const result = reducer(
      undefined,
      actions.fetchDataStart({
        requestKey: RequestKeys.GetCheckpointsBySymbol,
        args,
      })
    );

    expect(result[RequestKeys.GetCheckpointsBySymbol][argsHash]).toEqual({
      fetching: true,
    });
  });

  test('cacheData sets cached data and fetching to false', () => {
    const result = reducer(
      undefined,
      actions.cacheData({
        requestKey: RequestKeys.GetCheckpointsBySymbol,
        args,
        fetchedIds,
      })
    );

    expect(result[RequestKeys.GetCheckpointsBySymbol][argsHash]).toEqual({
      fetchedIds,
      fetching: false,
    });
  });

  test('fetchDataFail marks the request as failed', () => {
    const errorMessage = 'Some error';
    const error = new Error(errorMessage);
    const prevState = reducer(
      undefined,
      actions.fetchDataStart({
        requestKey: RequestKeys.GetCheckpointsBySymbol,
        args,
      })
    );

    const result = reducer(
      prevState,
      actions.fetchDataFail({
        errorMessage: error.message,
        requestKey: RequestKeys.GetCheckpointsBySymbol,
        args,
      })
    );

    expect(result[RequestKeys.GetCheckpointsBySymbol][argsHash]).toEqual({
      fetching: false,
      errorMessage,
    });
  });
});
