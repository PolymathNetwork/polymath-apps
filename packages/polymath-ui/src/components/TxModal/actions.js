// @flow

import type { ExtractReturn } from '../../redux/helpers';
import type { GetState } from '../../redux/reducer';

export const START = 'polymath/ui/tx/START';
export const FAILED = 'polymath/ui/tx/FAILED';
export const tx = (
  titles: string | Array<string>,
  code: () => any,
  successTitle: string,
  continueCode?: () => any,
  errorCode?: () => any,
  continueRoute?: string,
  continueLabel?: string,
  isNoEmail?: boolean,
  headingOverride?: string
) => async (dispatch: Function) => {
  // eslint-disable-next-line
  titles = typeof titles === 'string' ? [titles] : titles;
  dispatch({
    type: START,
    titles,
    successTitle,
    continueRoute,
    continueLabel,
    continueCode,
    errorCode,
    isNoEmail,
    headingOverride,
  });
  try {
    await code();
  } catch (error) {
    // eslint-disable-next-line
    console.error('Tx failed', error);
    dispatch({ type: FAILED, error });
  }
};

export const HASH = 'polymath/ui/tx/HASH';
export const txHash = (hash: string) => ({ type: HASH, hash });

export const END = 'polymath/ui/tx/END';
export const txEnd = (receipt: Object) => ({ type: END, receipt });

export const CONTINUE = 'polymath/ui/tx/CONTINUE';
export const txContinue = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const { error, continueRoute, continueCode, errorCode } = getState().pui.tx;
  dispatch({ type: CONTINUE });
  if (!error) {
    if (continueCode) {
      await continueCode();
    }
    //TODO @grsmto: UI components should not call any history change directly. That should be handled with a callback not by this component directly.
    if (continueRoute) {
      // NOTE @RafaelVidaurre: Hack to get programatical route changes working
      // $FlowFixMe
      getState().pui.common.history.push(continueRoute);
      getState().pui.common.history.push(continueRoute);
    }
  } else {
    if (errorCode) {
      await errorCode();
    }
  }
};

export type Action = ExtractReturn<typeof txHash> | ExtractReturn<typeof txEnd>;
