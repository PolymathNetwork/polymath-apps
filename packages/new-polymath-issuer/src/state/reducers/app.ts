import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';
import * as actions from '~/state/actions/app';
import { AppActions } from '~/state/actions/types';

export interface AppState {
  activeTransactionGroup?: string;
  polyClientInitialized: boolean;
  changingRoute: boolean;
}
const initialState: AppState = {
  polyClientInitialized: false,
  changingRoute: false,
};

export const reducer: Reducer<AppState, AppActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case getType(actions.setActiveTransactionGroup): {
      return {
        ...state,
        activeTransactionGroup: action.payload,
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
    default: {
      return { ...state };
    }
  }
};
