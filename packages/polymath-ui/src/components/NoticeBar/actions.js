// @flow

import { notice as fetchNotice } from '../../offchain';
import type { ExtractReturn } from '../../redux/helpers';

export const NOTICE = 'polymath/ui/notice/NOTICE';
export const getNotice = (scope: string, address: string) => async (
  dispatch: Function
) => {
  const addressesWithOldTokens = [];

  // if the issuer is in the list, show the special notification
  if (addressesWithOldTokens.find(notifyAddress => notifyAddress === address)) {
    dispatchTemporaryNotice(dispatch);
    return;
  }

  const notice = await fetchNotice(scope);
  if (!notice) {
    return;
  }
  if (notice.isOneTime) {
    // eslint-disable-next-line no-underscore-dangle
    const lsId = 'notice-' + notice._id;
    if (localStorage.getItem(lsId)) {
      return;
    }
    localStorage.setItem(lsId, true);
  }
  dispatch({ type: NOTICE, notice });
};

/**
 * NOTE @monitz87: this is a temporary function to notify issuers about the upcoming update
 * and security token migration in 11/15/2018. It should be removed after the upgrade
 */
const dispatchTemporaryNotice = (dispatch: Function) => {
  const notice = {
    type: 'warning',
    scope: 'issuer',
    title: 'Important Information',
    content:
      'Polymath is currently migrating your security tokens to an upgraded 2.0 release. Token distribution is disabled during this period and will resume by Nov. 15th - 12:00pm ET. We hope you enjoy the added functionality of your upgraded security tokens, and we apologize for any inconvenience.',
    isValid: true,
  };

  const lsId = 'notice-temp-token-migration';
  if (localStorage.getItem('notice-temp-token-migration')) {
    return;
  }
  localStorage.setItem(lsId, true);
  dispatch({ type: NOTICE, notice });
};

export const CLOSE = 'polymath/ui/notice/CLOSE';
export const closeNotice = () => ({ type: CLOSE });

export type Action = ExtractReturn<typeof closeNotice>;
