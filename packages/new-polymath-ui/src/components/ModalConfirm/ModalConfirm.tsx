import React, { FC } from 'react';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Modal } from '~/components/Modal';
import { Button } from '~/components/Button';
import { ButtonLarge } from '~/components/ButtonLarge';

type ModalProps = typeHelpers.GetProps<typeof Modal>;

export interface Props extends ModalProps {
  isActionDisabled?: boolean;
  actionButtonText?: string;
  cancelButtonText?: string;
  onSubmit: () => void;
  onClose: () => void;
}

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
        <Button variant="secondary" onClick={onClose}>
          {cancelButtonText}
        </Button>
        <ButtonLarge
          variant="primary"
          onClick={onSubmit}
          disabled={isActionDisabled}
        >
          {actionButtonText}
        </ButtonLarge>
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
