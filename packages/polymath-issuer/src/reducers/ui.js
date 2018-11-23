// @flow
import { LOCATION_CHANGE } from 'connected-react-router';

export type UIState = {
  header: {
    variant: 'default' | 'transparent',
  },
  footer: {
    variant: 'default' | 'transparent',
  },
};

const defaultState: UIState = {
  header: {
    variant: 'default',
  },
  footer: {
    variant: 'default',
  },
};

export default (state: UIState = defaultState, action) => {
  if (action.type === LOCATION_CHANGE) {
    switch (action.payload.location.pathname) {
      case '/':
        return {
          ...state,
          footer: {
            variant: 'transparent',
          },
        };
      default:
        return defaultState;
    }
  } else {
    return state;
  }
};
