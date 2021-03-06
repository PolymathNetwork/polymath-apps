import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';
import { utils } from '@polymathnetwork/new-shared';
import * as actions from '~/state/actions/dataRequests';
import { DataRequestsActions } from '~/state/actions/types';
import { RequestKeys } from '~/types';

export interface DataRequestResults {
  [argsHash: string]:
    | {
        fetching: boolean;
        fetchedIds: string[] | undefined;
        errorMessage?: string;
      }
    | undefined;
}

export interface DataRequestsState {
  [RequestKeys.GetCheckpointsBySymbol]: DataRequestResults;
  [RequestKeys.GetCheckpointBySymbolAndId]: DataRequestResults;
  [RequestKeys.GetSecurityTokenBySymbol]: DataRequestResults;
  [RequestKeys.GetDividendsByCheckpoint]: DataRequestResults;
  [RequestKeys.GetDividendBySymbolAndId]: DataRequestResults;
  [RequestKeys.GetErc20DividendsModuleBySymbol]: DataRequestResults;
  [RequestKeys.GetTaxWithholdingListBySymbolAndCheckpoint]: DataRequestResults;
  [RequestKeys.GetErc20BalanceByAddressAndWallet]: DataRequestResults;
}

const initialState: DataRequestsState = {
  [RequestKeys.GetCheckpointsBySymbol]: {},
  [RequestKeys.GetCheckpointBySymbolAndId]: {},
  [RequestKeys.GetSecurityTokenBySymbol]: {},
  [RequestKeys.GetDividendsByCheckpoint]: {},
  [RequestKeys.GetDividendBySymbolAndId]: {},
  [RequestKeys.GetErc20DividendsModuleBySymbol]: {},
  [RequestKeys.GetTaxWithholdingListBySymbolAndCheckpoint]: {},
  [RequestKeys.GetErc20BalanceByAddressAndWallet]: {},
};

export const reducer: Reducer<DataRequestsState, DataRequestsActions> = (
  state = initialState,
  action
): DataRequestsState => {
  switch (action.type) {
    case getType(actions.invalidateRequest): {
      const {
        payload: { requestKey, args },
      } = action;

      if (args) {
        const argsHash = utils.hashObj(args);
        const {
          [requestKey]: { [argsHash]: invalidData, ...validData },
          ...rest
        } = state;

        return {
          [requestKey]: {
            ...validData,
          },
          ...rest,
        } as DataRequestsState;
      }

      const { [requestKey]: invalidRequest, ...validRequests } = state;

      return {
        [requestKey]: {},
        ...validRequests,
      } as DataRequestsState;
    }

    case getType(actions.cacheData): {
      const {
        payload: { requestKey, args, fetchedIds },
      } = action;

      const argsHash = utils.hashObj(args);

      const {
        [requestKey]: { [argsHash]: invalidData, ...validData },
        ...validRequests
      } = state;

      return {
        [requestKey]: {
          [argsHash]: {
            fetching: false,
            fetchedIds,
          },
          ...validData,
        },
        ...validRequests,
      } as DataRequestsState;
    }

    case getType(actions.fetchDataStart): {
      const {
        payload: { requestKey, args },
      } = action;

      const argsHash = utils.hashObj(args);

      const {
        [requestKey]: { [argsHash]: invalidData, ...validData },
        ...validRequests
      } = state;

      return {
        [requestKey]: {
          [argsHash]: {
            fetching: true,
          },
          ...validData,
        },
        ...validRequests,
      } as DataRequestsState;
    }

    case getType(actions.fetchDataFail): {
      const {
        payload: { requestKey, args, errorMessage },
      } = action;

      const argsHash = utils.hashObj(args);
      const requests = state[requestKey] || {};
      const thisRequest = state[requestKey][argsHash] || {};

      return {
        ...state,
        [requestKey]: {
          ...requests,
          [argsHash]: {
            ...thisRequest,
            fetching: false,
            errorMessage,
          },
        },
      };
    }

    default: {
      return { ...state };
    }
  }
};
