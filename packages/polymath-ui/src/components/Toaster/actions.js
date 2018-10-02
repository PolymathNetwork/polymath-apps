// @flow

import type { Node } from 'react';

import type { ExtractReturn } from '../../redux/helpers';

export type Notify = {|
  title: string,
  isSuccess?: boolean,
  subtitle?: ?string,
  caption?: ?Node,
  isPinned?: ?boolean,
|};

export const NOTIFY = 'polymath/ui/toaster/NOTIFY';
export const notifyAction = (notify: Notify) => ({ type: NOTIFY, notify });
export const notify = (
  title: string,
  isSuccess: boolean = true,
  subtitle: ?string,
  caption: ?Node,
  isPinned: boolean = false
) => async (dispatch: Function) => {
  dispatch(notifyAction({ title, isSuccess, subtitle, caption, isPinned }));
};

export type Action = ExtractReturn<typeof notifyAction>;
