import React, { Component } from 'react';
import { types, typeHelpers } from '@polymathnetwork/new-shared';
import { SvgPaperplane } from '~/images/icons/Paperplane';
import { Icon } from '~/components/Icon';
import { Button } from '~/components/Button';
import { Paragraph } from '~/components/Paragraph';
import { Flex } from '~/components/Flex';
import { Box } from '~/components/Box';
import { Modal, ModalStatus } from '~/components/Modal';
import { TransactionItem } from './TransactionItem';
import { getTransactionQueueTitle } from '~/components/utils/contentMappings';

type ModalProps = typeHelpers.Omit<
  typeHelpers.GetProps<typeof Modal>,
  'status'
>;

const { TransactionQueueStatus } = types;

const getModalStatus = (status: types.TransactionQueueStatus) =>
  ({
    [TransactionQueueStatus.Idle]: ModalStatus.Loading,
    [TransactionQueueStatus.Running]: ModalStatus.Loading,
    [TransactionQueueStatus.Succeeded]: ModalStatus.Success,
    [TransactionQueueStatus.Failed]: ModalStatus.Alert,
  }[status]);

const getLabelText = (status: ModalStatus) =>
  ({
    [ModalStatus.Loading]: 'Processing',
    [ModalStatus.Idle]: 'Processing',
    [ModalStatus.Warning]: 'Failed',
    [ModalStatus.Alert]: 'Failed',
    [ModalStatus.Success]: 'Completed',
  }[status]);

export interface ModalTransactionQueueProps extends ModalProps {
  transactionQueue: types.TransactionQueuePojo;
  onContinue: () => void;
  withEmail?: boolean;
  continueButtonText?: string;
  getTitle: (queue: types.TransactionQueuePojo) => string;
  getTransactionTitle?: (transaction: types.TransactionPojo) => string;
}

export class ModalTransactionQueue extends Component<
  ModalTransactionQueueProps
> {
  public static defaultProps = {
    continueButtonText: 'Continue',
    getTitle: getTransactionQueueTitle,
  };

  public render() {
    const {
      transactionQueue,
      withEmail,
      isOpen,
      continueButtonText,
      onContinue,
      getTitle,
      getTransactionTitle,
    } = this.props;

    const { transactions, status } = transactionQueue;
    const modalStatus = getModalStatus(status);
    const isSuccess = status === TransactionQueueStatus.Succeeded;
    const isRejected = status === TransactionQueueStatus.Failed;

    return (
      <Modal
        isOpen={isOpen}
        isCloseable={false}
        status={modalStatus}
        maxWidth={500}
        isCentered={false}
      >
        <Modal.Header
          status={modalStatus}
          label={'Transaction ' + getLabelText(modalStatus)}
        >
          {getTitle(transactionQueue)}
        </Modal.Header>

        {transactions.map(transaction => (
          <TransactionItem
            key={transaction.uid}
            transaction={transaction}
            getTitle={getTransactionTitle}
          />
        ))}

        {isSuccess && withEmail && (
          <Flex mt="gridGap">
            <Box minWidth={50} mt={1}>
              <Icon Asset={SvgPaperplane} width="30" height="30" />
            </Box>
            <Paragraph fontSize={2}>
              We just sent you an email with the transaction details for your
              records. Check your inbox.
            </Paragraph>
          </Flex>
        )}

        {(isSuccess || isRejected) && (
          <Paragraph textAlign="center" mt="gridGap">
            <Button onClick={onContinue}>{continueButtonText}</Button>
          </Paragraph>
        )}
      </Modal>
    );
  }
}
