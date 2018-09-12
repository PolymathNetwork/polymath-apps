// @flow

import type { RouterHistory } from 'react-router-dom';

import * as a from './actions';

export type CommonState = {
  history: ?RouterHistory,
  isFetching: boolean,
};

const defaultState = {
  history: null,
  isFetching: false,
};

export default (state: CommonState = defaultState, action: a.Action) => {
  switch (action.type) {
    case a.SETUP_HISTORY:
      return {
        ...state,
        history: action.history,
      };
    case a.FETCHING:
      return {
        ...state,
        isFetching: true,
      };
    case a.FETCHED:
    case a.FETCHING_FAILED:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};
