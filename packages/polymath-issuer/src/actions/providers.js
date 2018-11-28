import * as ui from '@polymathnetwork/ui';

import {
  getProgress,
  getProviders,
  saveProgress,
} from '../pages/providers/data';

import type { GetState } from '../../redux/reducer';
import type { SPStatus } from '../pages/providers/data';

export const DATA = 'providers/DATA';
export const APPLICATION = 'providers/APPLICATION';

export const fetchProviders = (ticker: string) => (dispatch: Function) => {
  const progress = getProgress(ticker);
  const providers = [];
  for (const provider of getProviders()) {
    providers.push({
      ...provider,
      progress: progress[provider.id],
    });
  }
  dispatch({ type: DATA, providers });
};

export const applyProviders = (
  ids: Array<number>,
  application: Object
) => async (dispatch: Function, getState: GetState) => {
  try {
    // TODO @bshevchenko: await dispatch(emailProviders(ids))

    // $FlowFixMe
    const { ticker } = getState().token.token;
    const progress = getProgress(ticker);
    for (let id of ids) {
      progress[id] = {
        isApplied: true,
      };
    }
    saveProgress(ticker, progress);
    dispatch({ type: APPLICATION, application });
    dispatch(
      ui.providersApply({
        ids,
        ...application,
      })
    );
    dispatch(ui.notify('Your Application Has Been Sent', true));
    dispatch(fetchProviders(ticker));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('applyProviders failed.', err);
    ui.notify('Something Went Wrong Submitting Your Application', false);
  }
};

export const iHaveMyOwnProviders = (cat: number) => (
  dispatch: Function,
  getState: GetState
) => {
  // $FlowFixMe
  const { ticker } = getState().token.token;
  const progress = getProgress(ticker);
  for (const provider of getProviders()) {
    if (provider.cat === cat) {
      if (!progress[provider.id]) {
        progress[provider.id] = {
          isApplied: false,
        };
      }
    }
  }
  saveProgress(ticker, progress);
  dispatch(fetchProviders(ticker));
};

export const setProviderStatus = (id: number, status: SPStatus) => (
  dispatch: Function,
  getState: GetState
) => {
  // $FlowFixMe
  const { ticker } = getState().token.token;
  const progress = getProgress(ticker);
  progress[id].status = status;
  saveProgress(ticker, progress);
  dispatch(fetchProviders(ticker));
};
