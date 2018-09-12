import { notice as fetchNotice } from '../../offchain';
import type { ExtractReturn } from '../../redux/helpers';

export const NOTICE = '@polymathnetwork/uinotice/NOTICE';
export const getNotice = (scope: string) => async (dispatch: Function) => {
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

export const CLOSE = '@polymathnetwork/uinotice/CLOSE';
export const closeNotice = () => ({ type: CLOSE });

export type Action = ExtractReturn<typeof closeNotice>;
