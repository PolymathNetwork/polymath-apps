import * as a from '../actions/restrictions';

const defaultState = {
  isToggled: false,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case a.TOGGLE_RESTRICTIONS:
      return {
        ...state,
        isToggled: action.isToggled,
      };
    default:
      return state;
  }
};
