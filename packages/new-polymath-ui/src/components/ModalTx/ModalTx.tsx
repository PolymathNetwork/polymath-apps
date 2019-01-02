import React, { Component } from 'react';
import { types } from '@polymathnetwork/new-shared';

import { Icon } from '../Icon';
import { Button } from '../Button';
import { Paragraph } from '../Paragraph';
import { Modal, ModalProps, ModalStatus } from '../Modal';

import { ItemTx } from './ItemTx';
import * as S from './styles';
import polyIcon from '../../images/icons/Poly';

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
      transaction => transaction.status === types.TransactionStatus.Idle
    );

    if (!currentTransaction) {
      return null;
    }

    const currentTransactionIndex = transactions.indexOf(currentTransaction);

    return (
      <Modal isOpen={isOpen} isCloseable={false} status={status} maxWidth={500}>
        <Modal.Header
          status={status}
          label={'Transaction ' + labelText[status]}
        >
          {status === ModalStatus.loading
            ? 'Sign Transaction' + (transactions.length > 1 ? 's' : '')
            : currentTransaction.type}
        </Modal.Header>

        {transactions.map(transaction => (
          <ItemTx
            key={transaction.id}
            transaction={transaction}
            isActive={currentTransaction === transaction}
          />
        ))}

        {currentTransactionIndex === transactions.length && withEmail && (
          <div className="pui-tx-row pui-tx-email">
            <Icon Asset={polyIcon} />
            <Paragraph fontSize={2}>
              We just sent you an email with the transaction details for your
              records. Check your inbox.
            </Paragraph>
          </div>
        )}

        <Paragraph textAlign="center">
          {currentTransactionIndex === transactions.length ||
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
