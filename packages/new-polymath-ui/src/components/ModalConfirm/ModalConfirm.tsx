import * as React from 'react';

import { Button } from '~/components/Button';
import { Modal } from '~/components/Modal';

export interface ModalConfirmProps {
  children: Node;
  isActionDisabled: boolean;
  actionButtonText: string;
  cancelButtonText: string;
  onClose: () => void;
  onSubmit: () => void;
  isOpen: boolean;
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

ModalConfirm.defaultProps = {
  isActionDisabled: false,
  actionButtonText: 'Confirm',
  cancelButtonText: 'Cancel',
  onClose: null,
};
