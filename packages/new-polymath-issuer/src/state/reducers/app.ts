import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';
import * as actions from '~/state/actions/app';
import { AppActions } from '~/state/actions/types';
import { constants } from '@polymathnetwork/new-shared';

export interface AppState {
  activeTransactionQueue?: string;
  polyClientInitialized: boolean;
  changingRoute: boolean;
  networkId?: constants.NetworkIds;
}
const initialState: AppState = {
  polyClientInitialized: false,
  changingRoute: false,
};

export const reducer: Reducer<AppState, AppActions> = (
  state = initialState,
  action
): AppState => {
  switch (action.type) {
    case getType(actions.setActiveTransactionQueue): {
      return {
        ...state,
        activeTransactionQueue: action.payload,
      };
    }
    case getType(actions.unsetActiveTransactionQueue): {
      return {
        ...state,
        activeTransactionQueue: undefined,
      };
    }
    case getType(actions.initializePolyClientSuccess): {
      return {
        ...state,
        polyClientInitialized: true,
      };
    }
    case getType(actions.setChangingRoute): {
      return {
        ...state,
        changingRoute: action.payload,
      };
    }
    case getType(actions.setNetworkId): {
      return {
        ...state,
        networkId: action.payload,
      };
    }
    default: {
      return { ...state };
    }
  }
};
