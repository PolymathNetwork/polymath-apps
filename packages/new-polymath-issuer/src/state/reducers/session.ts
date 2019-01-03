import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';
import { Wallet, Identity } from '~/types';
import { SessionActions } from '~/state/actions/types';
import * as actions from '~/state/actions/session';

export interface SessionState {
  wallet?: Wallet;
  identity?: Identity;
}
const initialState: SessionState = {};

export const reducer: Reducer<SessionState, SessionActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case getType(actions.setIdentity): {
      return {
        ...state,
        identity: action.payload,
      };
    }
    case getType(actions.setWallet): {
      return {
        ...state,
        wallet: action.payload,
      };
    }
    default: {
      return { ...state };
    }
  }
};
