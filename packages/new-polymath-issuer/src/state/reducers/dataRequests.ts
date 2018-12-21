import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';
import * as actions from '~/state/actions/dataRequests';
import { DataRequestsActions } from '~/state/actions/types';
import { RequestKeys } from '~/types';

export interface DataRequestResults {
  [argsHash: string]: string[] | undefined;
}

export interface DataRequestsState {
  [RequestKeys.GetCheckpointsBySymbol]: DataRequestResults;
}
const initialState: DataRequestsState = {
  [RequestKeys.GetCheckpointsBySymbol]: {},
};

export const reducer: Reducer<DataRequestsState, DataRequestsActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case getType(actions.invalidateRequest): {
      return {
        ...state,
      };
    }
    default: {
      return { ...state };
    }
  }
};
