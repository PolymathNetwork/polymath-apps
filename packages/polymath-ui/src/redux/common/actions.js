// @flow

import type { RouterHistory } from 'react-router-dom';

import type { ExtractReturn } from '../../redux/helpers';

export const SETUP_HISTORY = 'polymath/ui/SETUP_HISTORY';
export const setupHistory = (history: RouterHistory) => ({
  type: SETUP_HISTORY,
  history,
});

export const FETCHING = 'polymath/ui/FETCHING';
export const fetching = () => ({ type: FETCHING });

export const FETCHED = 'polymath/ui/FETCHED';
export const fetched = () => ({ type: FETCHED });

export const FETCHING_FAILED = 'polymath/ui/FETCHING_FAILED';
export const fetchingFailed = (e: Error) => async (dispatch: Function) => {
  // eslint-disable-next-line
  console.error('Fetching failed', e);
  dispatch({ type: FETCHING_FAILED, message: e.message });
};

export type Action =
  | ExtractReturn<typeof setupHistory>
  | ExtractReturn<typeof fetching>
  | ExtractReturn<typeof fetched>;
