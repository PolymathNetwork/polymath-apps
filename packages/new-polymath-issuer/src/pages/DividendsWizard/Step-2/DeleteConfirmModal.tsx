import React, { FC, useState } from 'react';
import { ModalConfirm, Paragraph, ModalStatus } from '@polymathnetwork/new-ui';
import { types } from '@polymathnetwork/new-shared';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  addresses: string[];
}

export const DeleteConfirmModal: FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  addresses,
}) => {
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
      <ModalConfirm.Header>
        {addresses.length === 1
          ? 'Do You Want to Delete the Investor Wallet from the List?'
          : 'Do You Want to Delete All Marked Entries from the List?'}
      </ModalConfirm.Header>
      <Paragraph mb={0}>
        {addresses.length === 1
          ? `Please confirm that you want to delete the Investor Wallet from List.
            Once deleted, the Investor will no longer have taxes withheld
            automatically upon distribution of dividends.`
          : `Please confirm that you want to delete all the marked Investor Wallets from List.
            Once deleted, the Investors will no longer have taxes withheld
            automatically upon distribution of dividends.`}
      </Paragraph>
    </ModalConfirm>
  );
};
