import * as React from 'react';

import { ModalConfirm, ModalConfirmProps } from '~/components/ModalConfirm';

export const ModalConfirmTransactionQueue = (props: ModalConfirmProps) => {
  return <ModalConfirm maxWidth={500} {...props} />;
};

ModalConfirmTransactionQueue.Header = ModalConfirm.Header;
