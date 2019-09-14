import * as a from '../actions/restrictions';

const defaultState = {
  isToggled: false,
  defaultRestriction: null,
  defaultRestrictionModified: false,
  dailyRestriction: null,
  dailyRestrictionModified: false,
  individualRestrictions: [],
  individualRestriction: null,
  isCustomRestriction: false,
  isDailyRestriction: false,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case a.IS_CUSTOM_RESTRICTION:
      return {
        ...state,
        isCustomRestriction: action.state,
      };
    case a.IS_DAILY_RESTRICTION:
      return {
        ...state,
        isDailyRestriction: action.state,
      };
    case a.MODIFIED_INDIVIDUAL_RESTRICTION:
      let index = state.individualRestrictions.findIndex(
        i => i.address === action.individualRestriction.address
      );
      return {
        ...state,
        individualRestrictions: [
          ...state.individualRestrictions.slice(0, index),
          action.individualRestriction,
          ...state.individualRestrictions.slice(index + 1),
        ],
      };
    case a.ADD_INDIVIDUAL_RESTRICTION:
      return {
        ...state,
        individualRestrictions: [
          ...state.individualRestrictions,
          action.individualRestriction,
        ],
      };
    case a.MODIFY_INDIVIDUAL_RESTRICTION:
      return {
        ...state,
        individualRestriction: action.individualRestriction,
      };
    case a.LOAD_INDIVIDUAL_RESTRICTIONS:
      return {
        ...state,
        individualRestrictions: action.individualRestrictions,
      };
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
