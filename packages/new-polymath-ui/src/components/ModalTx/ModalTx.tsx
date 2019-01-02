import React, { Component } from 'react';

import { Loading } from '../Loading';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { Heading } from '../Heading';
import { Paragraph } from '../Paragraph';
import { Modal, ModalProps, ModalStatus } from '../Modal';

// import { etherscanTx } from '../../helpers';
import polyIcon from '../../images/icons/Poly';

enum TransactionStatus {
  'Idle',
  'Unnapproved',
  'Running',
  'Rejected',
  'Failed',
  'Successful',
}

type Transaction = {
  status: TransactionStatus;
  title: string;
};

const labelText = {
  [ModalStatus.loading]: 'Processing',
  [ModalStatus.idle]: 'Processing',
  [ModalStatus.warning]: 'Failed',
  [ModalStatus.alert]: 'Failed',
  [ModalStatus.success]: 'Completed',
};

export interface ModalTxProps extends ModalProps {
  title: string;
  transactions: Transaction[];
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
      transaction => transaction.status === TransactionStatus.Idle
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
            : currentTransaction.title}
        </Modal.Header>

        {transactions.map((transaction, i) => (
          <div
            key={transaction.title}
            className={
              'pui-tx-row' + (i > currentTransactionIndex ? ' pui-tx-next' : '')
            }
          >
            <div className="pui-tx-icon">
              {currentTransaction === transaction ? (
                currentTransaction.status === TransactionStatus.Rejected ? (
                  <Icon name="close" fill="#E71D32" width="32" height="32" />
                ) : (
                  <Loading small />
                )
              ) : i < currentTransactionIndex ? (
                <Icon name="checkmark" fill="#00AA5E" width="32" height="24" />
              ) : (
                ''
              )}
            </div>
            <div className="pui-tx-info">
              <Heading as="h3" variant="h3" mb="s">
                {currentTransaction.title}
              </Heading>
              <div className="pui-tx-details">
                Transaction details on Etherscan:&nbsp;
                {/* {hashes[i] ? etherscanTx(hashes[i]) : '...'} */}
              </div>
            </div>
          </div>
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
