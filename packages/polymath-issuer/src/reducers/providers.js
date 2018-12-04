// @flow

import * as a from '../actions/providers';
import type { ServiceProvider } from '../pages/providers/data';

export type ProvidersState = {
  data: ?Array<ServiceProvider>,
};

const defaultState: ProvidersState = {
  data: null,
  application: {},
};

export default (state: ProvidersState = defaultState, action: Object) => {
  switch (action.type) {
    case a.DATA:
      return {
        ...state,
        data: action.providers,
      };
    case a.APPLICATION:
      return {
        ...state,
        application: action.application,
      };
    default:
      return state;
  }
};
