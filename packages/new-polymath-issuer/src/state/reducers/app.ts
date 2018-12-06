import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';
import { Id } from '~/types';
import * as actions from '~/state/actions/app';
import { AppActions } from '~/state/actions/types';

export interface AppState {
  activeTransactionGroup?: Id;
}
const initialState: AppState = {};

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
