import React from 'react';

import { Modal, ModalProps } from '~/components/Modal';
import { Button } from '~/components/Button';

export interface ModalConfirmProps extends ModalProps {
  isActionDisabled: boolean;
  actionButtonText: string;
  cancelButtonText: string;
  onSubmit: () => void;
  onClose: () => void;
}

export const ModalConfirm = (props: ModalConfirmProps) => {
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      {...otherProps}
    >
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

ModalConfirm.Header = Modal.Header;
ModalConfirm.Body = Modal.Body;

ModalConfirm.defaultProps = {
  isActionDisabled: false,
  actionButtonText: 'Confirm',
  cancelButtonText: 'Cancel',
};
