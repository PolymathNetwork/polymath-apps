import * as React from 'react';

import { ModalConfirm, ModalConfirmProps } from '~/components/ModalConfirm';

type Props = ModalConfirmProps;
export type ModalConfirmTransactionProps = JSX.LibraryManagedAttributes<
  typeof ModalConfirmTransactionQueue,
  Props
>;

const ModalConfirmTransactionQueueBase = (props: Props) => {
  return <ModalConfirm maxWidth={500} {...props} />;
};

export const ModalConfirmTransactionQueue = Object.assign(
  ModalConfirmTransactionQueueBase,
  {
    Header: ModalConfirm.Header,
  }
);
