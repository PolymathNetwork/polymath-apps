import React, { Component } from 'react';
import { types } from '@polymathnetwork/new-shared';

import { Icon } from '../Icon';
import { Button } from '../Button';
import { Paragraph } from '../Paragraph';
import { Grid } from '../Grid';
import { Box } from '../Box';
import { Modal, ModalProps, ModalStatus } from '../Modal';

import { SvgPaperplane } from '~/images/icons/Paperplane';

import { ItemTx } from './ItemTx';

const { TransactionStatus } = types;

const labelText = {
  [ModalStatus.loading]: 'Processing',
  [ModalStatus.idle]: 'Processing',
  [ModalStatus.warning]: 'Failed',
  [ModalStatus.alert]: 'Failed',
  [ModalStatus.success]: 'Completed',
};

export interface ModalTxProps extends ModalProps {
  title: string;
  transactions: types.Transaction[];
  withEmail: boolean;
  continueButtonText: string;
}

export class ModalTx extends Component<ModalTxProps> {
  static defaultProps = {
    continueButtonText: 'Continue',
  };

  handleContinue = () => {
    this.props.txContinue();
  };

  // eslint-disable-next-line
  render() {
    const {
      status,
      title,
      transactions,
      withEmail,
      isOpen,
      continueButtonText,
    } = this.props;

    const currentTransaction = transactions.find(
      transaction =>
        transaction.status !== types.TransactionStatus.Idle &&
        transaction.status !== types.TransactionStatus.Succeeded
    );

    if (!currentTransaction) {
      return null;
    }

    const currentTransactionIndex = transactions.indexOf(currentTransaction);

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
          label={'Transaction ' + labelText[status]}
        >
          {status === ModalStatus.loading
            ? 'Sign Transaction' + (transactions.length > 1 ? 's' : '')
            : currentTransaction.type}
        </Modal.Header>

        {transactions.map(transaction => (
          <ItemTx key={transaction.id} transaction={transaction} />
        ))}

        {currentTransactionIndex === transactions.length - 1 && withEmail && (
          <Grid gridTemplateColumns="35px 1fr" mt="gridGap">
            <Box mt={1}>
              <Icon Asset={SvgPaperplane} width="30" height="30" />
            </Box>
            <Paragraph fontSize={2}>
              We just sent you an email with the transaction details for your
              records. Check your inbox.
            </Paragraph>
          </Grid>
        )}

        <Paragraph textAlign="center">
          {currentTransactionIndex === transactions.length - 1 ||
            (currentTransaction.status === TransactionStatus.Rejected && (
              <Button onClick={this.handleContinue}>
                {continueButtonText}
              </Button>
            ))}
        </Paragraph>
      </Modal>
    );
  }
}
