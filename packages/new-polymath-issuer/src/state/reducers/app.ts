import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';
import * as actions from '~/state/actions/app';
import { AppActions } from '~/state/actions/types';
import { AppStages } from '~/types';

export interface AppState {
  activeTransactionGroup?: string;
  polyClientInitialized: boolean;
}
const initialState: AppState = {
  polyClientInitialized: false,
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
    default: {
      return state;
    }
  }
};
