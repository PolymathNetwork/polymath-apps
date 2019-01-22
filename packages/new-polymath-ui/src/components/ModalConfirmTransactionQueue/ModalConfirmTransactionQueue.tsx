import React, { FC } from 'react';
import { types, typeHelpers } from '@polymathnetwork/new-shared';
import { ModalConfirm } from '~/components/ModalConfirm';
import { Paragraph } from '~/components/Paragraph';
import { TransactionItem } from '~/components/TransactionItem';
import { ModalStatus } from '~/components/Modal/types';
import { getTransactionQueueText, getTransactionText } from './contentMappings';

type ModalConfirmProps = typeHelpers.GetProps<typeof ModalConfirm>;

interface TransactionQueue extends types.TransactionQueueEntity {
  transactions: types.TransactionEntity[];
}

interface Props extends ModalConfirmProps {
  transactionQueue: TransactionQueue;
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
        {transactionQueue.transactions.map(transaction => {
          const transactionText = getTransactionText(transaction);
          return (
            <TransactionItem
              key={transaction.uid}
              Asset={transactionText.Icon}
              title={transactionText.title}
              description={transactionText.description}
            />
          );
        })}
      </div>
    </ModalConfirm>
  );
};
