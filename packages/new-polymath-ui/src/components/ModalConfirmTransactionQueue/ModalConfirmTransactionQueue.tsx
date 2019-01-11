import * as React from 'react';

import { ModalConfirm, ModalConfirmProps } from '~/components/ModalConfirm';

interface Props
  extends JSX.LibraryManagedAttributes<
    typeof ModalConfirm,
    ModalConfirmProps
  > {}

const ModalConfirmTransactionQueueBase = (props: Props) => {
  return <ModalConfirm maxWidth={500} {...props} />;
};

export const ModalConfirmTransactionQueue = Object.assign(
  ModalConfirmTransactionQueueBase,
  {
    Header: ModalConfirm.Header,
  }
);
