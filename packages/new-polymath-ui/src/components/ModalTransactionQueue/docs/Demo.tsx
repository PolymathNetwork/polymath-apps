import React, { Fragment } from 'react';
import { types } from '@polymathnetwork/new-shared';
import { ModalConfirm } from '~/components/ModalConfirm';
import { ModalTransactionQueue } from '../ModalTransactionQueue';

const transactionQueue = {
  id: '111',
  name: 'Dividend Configuration',
  status: types.TransactionQueueStatus.Idle,
  transactions: [
    {
      uid: '0',
      type: 'First transaction',
      status: types.TransactionStatus.Unapproved,
    },
    {
      uid: '1',
      type: 'Second transaction',
      status: types.TransactionStatus.Idle,
    },
  ],
};

interface DemoState {
  isModalOpen: boolean;
  transactionQueue: types.TransactionQueueEntity;
}

export class ModalDemo extends React.Component<{}, DemoState> {
  public state = {
    isModalOpen: false,
    transactionQueue,
  };

  public componentDidUpdate(_prevProps: any, prevState: DemoState) {
    if (!prevState.isModalOpen && this.state.isModalOpen) {
      // Reset Modal state
      this.setState({
        transactionQueue,
      });

      setTimeout(() => {
        this.setState({
          transactionQueue: {
            ...this.state.transactionQueue,
            status: types.TransactionQueueStatus.Running,
            transactions: [
              {
                uid: '0',
                type: 'First transaction',
                status: types.TransactionStatus.Running,
              },
              {
                uid: '1',
                type: 'Second transaction',
                status: types.TransactionStatus.Idle,
              },
            ],
          },
        });
      }, 1000);

      setTimeout(() => {
        this.setState({
          transactionQueue: {
            ...this.state.transactionQueue,
            transactions: [
              {
                uid: '0',
                type: 'First transaction',
                status: types.TransactionStatus.Succeeded,
                hash: '0xcEe94E5D4c424E229af969Aa1c1fD0e1a9DE9ADB',
              },
              {
                uid: '1',
                type: 'Second transaction',
                status: types.TransactionStatus.Unapproved,
              },
            ],
          },
        });
      }, 2000);

      setTimeout(() => {
        this.setState({
          transactionQueue: {
            ...this.state.transactionQueue,
            transactions: [
              {
                uid: '0',
                type: 'First transaction',
                status: types.TransactionStatus.Succeeded,
                hash: '0xcEe94E5D4c424E229af969Aa1c1fD0e1a9DE9ADB',
              },
              {
                uid: '1',
                type: 'Second transaction',
                status: types.TransactionStatus.Running,
              },
            ],
          },
        });
      }, 3000);

      setTimeout(() => {
        this.setState({
          transactionQueue: {
            ...this.state.transactionQueue,
            status: types.TransactionQueueStatus.Succeeded,
            transactions: [
              {
                uid: '0',
                type: 'First transaction',
                status: types.TransactionStatus.Succeeded,
                hash: '0xcEe94E5D4c424E229af969Aa1c1fD0e1a9DE9ADB',
              },
              {
                uid: '1',
                type: 'Second transaction',
                status: types.TransactionStatus.Succeeded,
                hash: '0xcEe94E5D4c424E229af969Aa1c1fD0e1a9DE9ADB',
              },
            ],
          },
        });
      }, 4000);
    }
  }

  public handleClick = () => {
    this.setState({
      isModalOpen: true,
    });
  };

  public handleModalClose = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  public handleContinue = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  public render() {
    return (
      <Fragment>
        <button className="btn" onClick={this.handleClick}>
          Start transaction
        </button>

        <ModalConfirm
          isOpen={this.state.isModalOpen}
          onSubmit={this.handleSubmit}
          onClose={this.handleModalClose}
          {...this.props}
        >
          <ModalConfirm.Header>
            Proceed with Your {getTransactionQueueTitle(transactionQueue)}
          </ModalConfirm.Header>
          <Paragraph>{getTransactionQueueDesc(transactionQueue)}</Paragraph>
          <div>
            {transactionQueue.transactions.map(transaction => (
              <TransactionItem
                key={transaction.id}
                icon={getTransactionIcon(transaction)}
                title={getTransactionTitle(transaction)}
                description={getTransactionDesc(transaction)}
              />
            ))}
          </div>
        </ModalConfirm>

        <ModalTransactionQueue
          isOpen={this.state.isModalOpen}
          transactionQueue={this.state.transactionQueue}
          withEmail
          onContinue={this.handleContinue}
        />
      </Fragment>
    );
  }
}
