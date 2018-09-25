// @flow
import * as a from './actions';
import type { Action } from './actions';

export type NoticeState = {
  isOpen: boolean,
  notice: ?Object,
};

const defaultState: NoticeState = {
  isOpen: false,
  notice: null,
};

export default (state: NoticeState = defaultState, action: Action) => {
  switch (action.type) {
    case a.NOTICE:
      return {
        ...state,
        isOpen: true,
        notice: action.notice,
      };
    case a.CLOSE:
      return {
        ...state,
        isOpen: false,
      };
    default:
      return state;
  }
};
