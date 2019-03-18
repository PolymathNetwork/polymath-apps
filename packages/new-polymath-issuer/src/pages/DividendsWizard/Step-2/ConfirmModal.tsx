import React, { FC } from 'react';
import { ModalConfirm, Paragraph, ModalStatus } from '@polymathnetwork/new-ui';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  const onSubmit = () => {
    onConfirm();
  };
  return (
    <ModalConfirm
      isOpen={isOpen}
      onSubmit={onSubmit}
      onClose={onClose}
      actionButtonText="Confirm"
      maxWidth={500}
      status={ModalStatus.Warning}
    >
      <ModalConfirm.Header>You Have Pending Changes</ModalConfirm.Header>
      <Paragraph>
        To apply your new/modified tax withholding entries, simply hit "CANCEL"
        and click on "UPDATE" above the Tax Withholdings table.
      </Paragraph>
      <Paragraph mb={0}>
        To ignore the new/modified tax withholding entries, simply hit "PROCEED"
      </Paragraph>
    </ModalConfirm>
  );
};
