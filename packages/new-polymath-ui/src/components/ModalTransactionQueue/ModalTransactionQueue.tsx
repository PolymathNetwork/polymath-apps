import React, { Component } from 'react';
import { types } from '@polymathnetwork/new-shared';

import { Icon } from '../Icon';
import { Button } from '../Button';
import { Paragraph } from '../Paragraph';
import { Flex } from '../Flex';
import { Box } from '../Box';
import { Modal, ModalProps, ModalStatus } from '../Modal';

import { SvgPaperplane } from '~/images/icons/Paperplane';

import { TransactionItem } from './TransactionItem';

const { TransactionQueueStatus } = types;

const getModalStatus = (status: types.TransactionQueueStatus) =>
  ({
    [TransactionQueueStatus.Idle]: ModalStatus.loading,
    [TransactionQueueStatus.Running]: ModalStatus.loading,
    [TransactionQueueStatus.Succeeded]: ModalStatus.success,
    [TransactionQueueStatus.Failed]: ModalStatus.alert,
  }[status]);

const getLabelText = (status: ModalStatus) =>
  ({
    [ModalStatus.loading]: 'Processing',
    [ModalStatus.idle]: 'Processing',
    [ModalStatus.warning]: 'Failed',
    [ModalStatus.alert]: 'Failed',
    [ModalStatus.success]: 'Completed',
  }[status]);

const getTitleText = (status: ModalStatus, title: string) =>
  ({
    [ModalStatus.idle]: `Processing with Your ${title}`,
    [ModalStatus.loading]: `Processing with Your ${title}`,
    [ModalStatus.warning]: `An error occured with Your ${title}`,
    [ModalStatus.alert]: `An error occured with Your ${title}`,
    [ModalStatus.success]: `Your ${title} was successfully submitted`,
  }[status]);

export interface ModalTransactionQueueProps extends ModalProps {
  transactionQueue: types.HigherLevelTransaction;
  onContinue: () => void;
  withEmail?: boolean;
  continueButtonText?: string;
}

export class ModalTransactionQueue extends Component<
  ModalTransactionQueueProps
> {
  static defaultProps = {
    continueButtonText: 'Continue',
  };

  public render() {
    const {
      transactionQueue,
      withEmail,
      isOpen,
      continueButtonText,
      onContinue,
    } = this.props;
    const { transactions } = transactionQueue;
    const status = getModalStatus(transactionQueue.status);
    const isSuccess =
      transactionQueue.status === TransactionQueueStatus.Succeeded;
    const isRejected =
      transactionQueue.status === TransactionQueueStatus.Failed;

    return (
      <Modal
        isOpen={isOpen}
        isCloseable={false}
        status={status}
        maxWidth={500}
        isCentered={false}
      >
        <Modal.Header
          status={status}
          label={'Transaction ' + getLabelText(status)}
        >
          {getTitleText(status, transactionQueue.name)}
        </Modal.Header>

        {transactions.map(transaction => (
          <TransactionItem key={transaction.id} transaction={transaction} />
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
