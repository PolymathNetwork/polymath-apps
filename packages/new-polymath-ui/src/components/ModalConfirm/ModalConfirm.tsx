import React, { FC } from 'react';

import { Modal, ModalProps } from '~/components/Modal';
import { Button } from '~/components/Button';

export interface Props extends ModalProps {
  isActionDisabled: boolean;
  actionButtonText: string;
  cancelButtonText: string;
  onSubmit: () => void;
  onClose: () => void;
}

export type ModalConfirmProps = JSX.LibraryManagedAttributes<
  typeof ModalConfirmBase,
  Props
>;

const ModalConfirmBase: FC<Props> = props => {
  const {
    isOpen,
    onClose,
    onSubmit,
    isActionDisabled,
    actionButtonText,
    cancelButtonText,
    children,
    ...otherProps
  } = props;
  return (
    <Modal isOpen={isOpen} onClose={onClose} {...otherProps}>
      {children}
      <Modal.Footer>
        <Button kind="secondary" onClick={onClose}>
          {cancelButtonText}
        </Button>
        <Button onClick={onSubmit} disabled={isActionDisabled}>
          {actionButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const ModalConfirm = Object.assign(ModalConfirmBase, {
  Header: Modal.Header,
  Body: Modal.Body,
  defaultProps: {
    isActionDisabled: false,
    actionButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
  },
});
