import React, { FC } from 'react';
import { types, typeHelpers } from '@polymathnetwork/new-shared';
import { ModalConfirm } from '~/components/ModalConfirm';
import { Paragraph } from '~/components/Paragraph';
import { TransactionItem } from '~/components/TransactionItem';
import { ModalStatus } from '~/components/Modal/types';
import { getTransactionText } from './contentMappings';

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
  return (
    <ModalConfirm
      isOpen={!!transactionQueue}
      maxWidth={500}
      status={ModalStatus.Idle}
      isCentered={false}
      {...props}
    >
      <ModalConfirm.Header>
        {transactionQueue.procedureType}
      </ModalConfirm.Header>
      <Paragraph fontSize={2}>{transactionQueue.description}</Paragraph>
      <div>
        {transactionQueue.transactions.map(transaction => {
          const { title, description, Icon } = getTransactionText(transaction);
          return (
            <TransactionItem
              key={transaction.uid}
              Asset={Icon}
              title={title}
              description={description}
            />
          );
        })}
      </div>
    </ModalConfirm>
  );
};
