import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';
import { NetworkActions } from '~/state/actions/types';
import * as actions from '~/state/actions/network';
import { NetworkStatus, NetworkClientSupport } from '~/types';

export interface NetworkState {
  status: NetworkStatus;
  clientSupport?: NetworkClientSupport;
}

const initialState: NetworkState = {
  status: NetworkStatus.NotInitialized,
};

export const reducer: Reducer<NetworkState, NetworkActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case getType(actions.setStatus): {
      return {
        ...state,
        status: action.payload,
      };
    }
    case getType(actions.setClientSupport): {
      return {
        ...state,
        clientSupport: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
