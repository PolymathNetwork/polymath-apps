// @flow
import type { Node } from 'react';

import * as a from './actions';
import type { Action } from './actions';

export type ModalState = {
  isOpen: boolean,
  title: string,
  content: ?Node,
  onConfirm: () => void,
  className: string,
  headerLabel: string,
  buttonLabel: string,
  isAlert: boolean,
};

const defaultState: ModalState = {
  isOpen: false,
  title: '',
  content: null,
  onConfirm: () => {},
  className: '',
  headerLabel: '',
  buttonLabel: '',
  isAlert: false,
};

export default (state: ModalState = defaultState, action: Action) => {
  switch (action.type) {
    case a.CONFIRM:
      return {
        ...state,
        ...action,
        isOpen: true,
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
