// @flow

import type { Node } from 'react';
import type { ExtractReturn } from '../../redux/helpers';

export const CONFIRM = 'polymath/ui/modal/CONFIRM';
export const confirm = (
  content: Node,
  onConfirm: () => void,
  title: string = 'Before You Proceed',
  buttonLabel: string = 'Confirm',
  className: string = '',
  headerLabel: string = 'Confirmation Required',
  isAlert: boolean = false
) => ({
  type: CONFIRM,
  content,
  onConfirm,
  title,
  className,
  headerLabel,
  buttonLabel,
  isAlert,
});

export const CLOSE = 'polymath/ui/modal/CLOSE';
export const closeModal = () => ({ type: CLOSE });

export type Action =
  | ExtractReturn<typeof confirm>
  | ExtractReturn<typeof closeModal>;
