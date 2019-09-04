import * as a from '../actions/restrictions';

const defaultState = {
  isToggled: false,
  defaultRestriction: null,
  defaultRestrictionModified: false,
  dailyRestriction: null,
  dailyRestrictionModified: false,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case a.MODIFY_DAILY_RESTRICTION:
      return {
        ...state,
        dailyRestrictionModified: action.isModified,
      };
    case a.MODIFY_DEFAULT_RESTRICTION:
      return {
        ...state,
        defaultRestrictionModified: action.isModified,
      };
    case a.TOGGLE_RESTRICTIONS:
      return {
        ...state,
        isToggled: action.isToggled,
      };
    default:
      return state;
    case a.DEFAULT_RESTRICTION:
      return {
        ...state,
        defaultRestriction: action.restriction,
      };
    case a.DAILY_RESTRICTION:
      return {
        ...state,
        dailyRestriction: action.restriction,
      };
  }
};
