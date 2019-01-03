import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';
import * as actions from '~/state/actions/dataRequests';
import { DataRequestsActions } from '~/state/actions/types';
import { RequestKeys } from '~/types';
import { hashObj } from '~/utils';

export interface DataRequestResults {
  [argsHash: string]: string[] | undefined;
}

export interface DataRequestsState {
  [RequestKeys.GetCheckpointsBySymbol]: DataRequestResults;
  [RequestKeys.GetSecurityTokenBySymbol]: DataRequestResults;
}

const initialState: DataRequestsState = {
  [RequestKeys.GetCheckpointsBySymbol]: {},
  [RequestKeys.GetSecurityTokenBySymbol]: {},
};

export const reducer: Reducer<DataRequestsState, DataRequestsActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case getType(actions.invalidateRequest): {
      const {
        payload: { requestKey, args },
      } = action;

      if (args) {
        const argsHash = hashObj(args);
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

      const argsHash = hashObj(args);

      const {
        [requestKey]: { [argsHash]: invalidData, ...validData },
        ...validRequests
      } = state;

      return {
        [requestKey]: {
          [argsHash]: fetchedIds,
          ...validData,
        },
        ...validRequests,
      } as DataRequestsState;
    }
    // TODO @monitz87: handle fetchDataError action
    default: {
      return { ...state };
    }
  }
};
