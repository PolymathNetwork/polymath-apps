import React, { Component } from 'react';
import { types } from '@polymathnetwork/new-shared';

import { Icon } from '../Icon';
import { Button } from '../Button';
import { Paragraph } from '../Paragraph';
import { Flex } from '../Flex';
import { Box } from '../Box';
import { Modal, ModalProps, ModalStatus } from '../Modal';

// import { ReactComponent as SvgPaperplane } from '~/images/icons/paperplane.svg';

import { SequenceItem } from './SequenceItem';

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

export interface ModalSequenceProps
  extends Pick<
    ModalProps,
    'isOpen' | 'isCloseable' | 'status' | 'maxWidth' | 'isCentered'
  > {
  transactionQueue: types.TransactionQueueEntity & {
    transactions: types.TransactionEntity[];
  };
  onContinue: () => void;
  withEmail?: boolean;
  continueButtonText?: string;
}

export class ModalSequence extends Component<ModalSequenceProps> {
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
    // FIXME @grsmto: make this not crash if transactionQueue is null but still
    // render the modal
    if (!transactionQueue) {
      return null;
    }

    const { transactions, status, procedureType } = transactionQueue;
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
          status={status}
          label={'Transaction ' + getLabelText(modalStatus)}
        >
          {getTitleText(modalStatus, procedureType)}
        </Modal.Header>

        {transactions.map(transaction => (
          <SequenceItem key={transaction.uid} transaction={transaction} />
        ))}

        {isSuccess && withEmail && (
          <Flex mt="gridGap">
            <Box minWidth={50} mt={1}>
              {/* // FIXME @grsmto: svgs aren't compiling properly */}
              {/* <Icon Asset={SvgPaperplane} width="30" height="30" /> */}
              <Icon Asset={null} width="30" height="30" />
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
