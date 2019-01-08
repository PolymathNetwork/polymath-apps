import React, { Component } from 'react';
import { types } from '@polymathnetwork/new-shared';

import { Icon } from '../Icon';
import { Button } from '../Button';
import { Paragraph } from '../Paragraph';
import { Flex } from '../Flex';
import { Box } from '../Box';
import { Modal, ModalProps, ModalStatus } from '../Modal';

import { ReactComponent as SvgPaperplane } from '~/images/icons/paperplane.svg';

import { ItemTx } from './ItemTx';

const { HigherLevelTransactionStatus } = types;

const getModalStatus = (status: types.HigherLevelTransactionStatus) =>
  ({
    [HigherLevelTransactionStatus.Idle]: ModalStatus.loading,
    [HigherLevelTransactionStatus.Running]: ModalStatus.loading,
    [HigherLevelTransactionStatus.Succeeded]: ModalStatus.success,
    [HigherLevelTransactionStatus.Failed]: ModalStatus.alert,
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

export interface ModalTxProps extends ModalProps {
  title: string;
  sequence: types.HigherLevelTransaction;
  withEmail: boolean;
  continueButtonText: string;
  onContinue: () => void;
}

export class ModalTx extends Component<ModalTxProps> {
  static defaultProps = {
    continueButtonText: 'Continue',
  };

  public render() {
    const {
      sequence,
      withEmail,
      isOpen,
      continueButtonText,
      onContinue,
    } = this.props;
    const { transactions } = sequence;
    const status = getModalStatus(sequence.status);
    const isSuccess =
      sequence.status === HigherLevelTransactionStatus.Succeeded;
    const isRejected = sequence.status === HigherLevelTransactionStatus.Failed;

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
          {getTitleText(status, sequence.name)}
        </Modal.Header>

        {transactions.map(transaction => (
          <ItemTx key={transaction.id} transaction={transaction} />
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
