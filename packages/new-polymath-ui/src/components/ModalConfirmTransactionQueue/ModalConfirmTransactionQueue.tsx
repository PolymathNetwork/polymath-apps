import React, { FC } from 'react';
import { types, typeHelpers } from '@polymathnetwork/new-shared';
import { ModalConfirm } from '~/components/ModalConfirm';
import { Paragraph } from '~/components/Paragraph';
import { ModalStatus } from '~/components/Modal/types';
import { getTransactionQueueText } from '~/components/utils/contentMappings';
import { TransactionItem } from './TransactionItem';

type ModalConfirmProps = typeHelpers.GetProps<typeof ModalConfirm>;

interface Props extends ModalConfirmProps {
  transactionQueue: types.TransactionQueuePojo;
}

export const ModalConfirmTransactionQueue: FC<Props> = ({
  transactionQueue,
  ...props
}) => {
  const transactionQueueText = getTransactionQueueText(transactionQueue);
  return (
    <ModalConfirm
      isOpen={!!transactionQueue}
      maxWidth={500}
      status={ModalStatus.Idle}
      isCentered={false}
      {...props}
    >
      <ModalConfirm.Header>{transactionQueueText.title}</ModalConfirm.Header>
      <Paragraph fontSize={2}>{transactionQueueText.description}</Paragraph>
      <div>
        {transactionQueue.transactions.map(transaction => (
          <TransactionItem key={transaction.uid} transaction={transaction} />
        ))}
      </div>
    </ModalConfirm>
  );
};
