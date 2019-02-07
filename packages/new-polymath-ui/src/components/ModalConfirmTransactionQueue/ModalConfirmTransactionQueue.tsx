import React, { FC } from 'react';
import { types, typeHelpers } from '@polymathnetwork/new-shared';
import { ModalConfirm } from '~/components/ModalConfirm';
import { Paragraph } from '~/components/Paragraph';
import { ModalStatus } from '~/components/Modal/types';
import { getTransactionQueueContent } from '~/components/utils/contentMappings';
import { TransactionItem } from './TransactionItem';

type ModalConfirmProps = typeHelpers.GetProps<typeof ModalConfirm>;

interface Props extends ModalConfirmProps {
  transactionQueue: types.TransactionQueuePojo;
  getContent: (
    queue: types.TransactionQueuePojo
  ) => {
    title: string;
    description?: string;
  };
}

const ModalConfirmTransactionQueue: FC<Props> & {
  defaultProps: { getContent: Props['getContent'] };
} = ({ transactionQueue, getContent, ...props }) => {
  const { title, description } = getContent(transactionQueue);
  return (
    <ModalConfirm
      isOpen={!!transactionQueue}
      maxWidth={500}
      status={ModalStatus.Idle}
      isCentered={false}
      {...props}
    >
      <ModalConfirm.Header>{title}</ModalConfirm.Header>
      {description ? <Paragraph fontSize={2}>{description}</Paragraph> : null}
      <div>
        {transactionQueue.transactions.map(transaction => (
          <TransactionItem key={transaction.uid} transaction={transaction} />
        ))}
      </div>
    </ModalConfirm>
  );
};

ModalConfirmTransactionQueue.defaultProps = {
  getContent: getTransactionQueueContent,
};

export { ModalConfirmTransactionQueue };
