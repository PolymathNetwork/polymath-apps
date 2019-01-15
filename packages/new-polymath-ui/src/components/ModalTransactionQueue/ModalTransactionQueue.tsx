import React, { Component } from 'react';
import { types, typeHelpers } from '@polymathnetwork/new-shared';
import { SvgPaperplane } from '~/images/icons/Paperplane';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { Paragraph } from '../Paragraph';
import { Flex } from '../Flex';
import { Box } from '../Box';
import { Modal, ModalStatus } from '../Modal';
import { TransactionItem } from './TransactionItem';

type ModalProps = typeHelpers.Omit<
  typeHelpers.GetProps<typeof Modal>,
  'status'
>;

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
    [ModalStatus.idle]: `Proceed with ${title}`,
    [ModalStatus.loading]: `Proceed with ${title}`,
    [ModalStatus.warning]: `An error occured with ${title}`,
    [ModalStatus.alert]: `An error occured with ${title}`,
    [ModalStatus.success]: `${title} was successfully submitted`,
  }[status]);

interface TransactionQueue extends types.TransactionQueueEntity {
  transactions: types.TransactionEntity[];
}

export interface ModalTransactionQueueProps extends ModalProps {
  transactionQueue: TransactionQueue;
  onContinue: () => void;
  withEmail?: boolean;
  continueButtonText?: string;
}

export class ModalTransactionQueue extends Component<
  ModalTransactionQueueProps
> {
  public static defaultProps = {
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

    const { transactions, status, description } = transactionQueue;
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
          {getTitleText(modalStatus, description)}
        </Modal.Header>

        {transactions.map(transaction => (
          <TransactionItem key={transaction.uid} transaction={transaction} />
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
