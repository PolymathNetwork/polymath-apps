import React, { Fragment } from 'react';
import { types } from '@polymathnetwork/new-shared';

import { Button } from '~/components/Button';
import { Paragraph } from '~/components/Paragraph';
import { TransactionItem } from '~/components/TransactionItem';
import { ModalTransactionQueue } from '~/components/ModalTransactionQueue';
import { ModalConfirmTransactionQueue } from '~/components/ModalConfirmTransactionQueue';

import { SvgErc20 } from '~/images/icons/Erc20';
import { Modal } from '~/components/Modal';

const transactionQueue = {
  id: '111',
  name: 'Dividend Configuration',
  status: types.HigherLevelTransactionStatus.Idle,
  transactions: [
    {
      id: '0',
      type: 'First transaction',
      status: types.TransactionStatus.Unapproved,
    },
    {
      id: '1',
      type: 'Second transaction',
      status: types.TransactionStatus.Idle,
    },
  ],
};

export class Demo extends React.Component {
  state = {
    isConfirming: false,
    isTransactionQueueStarted: false,
    transactionQueue,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      !prevState.isTransactionQueueStarted &&
      this.state.isTransactionQueueStarted
    ) {
      // Reset Modal state
      this.setState({
        transactionQueue,
      });

      setTimeout(() => {
        this.setState({
          transactionQueue: {
            ...this.state.transactionQueue,
            status: types.HigherLevelTransactionStatus.Running,
            transactions: [
              {
                id: '0',
                type: 'First transaction',
                status: types.TransactionStatus.Running,
              },
              {
                id: '1',
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
                id: '0',
                type: 'First transaction',
                status: types.TransactionStatus.Succeeded,
                hash: '0xcEe94E5D4c424E229af969Aa1c1fD0e1a9DE9ADB',
              },
              {
                id: '1',
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
                id: '0',
                type: 'First transaction',
                status: types.TransactionStatus.Succeeded,
                hash: '0xcEe94E5D4c424E229af969Aa1c1fD0e1a9DE9ADB',
              },
              {
                id: '1',
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
            status: types.HigherLevelTransactionStatus.Succeeded,
            transactions: [
              {
                id: '0',
                type: 'First transaction',
                status: types.TransactionStatus.Succeeded,
                hash: '0xcEe94E5D4c424E229af969Aa1c1fD0e1a9DE9ADB',
              },
              {
                id: '1',
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

  handleStart = () => {
    this.setState({
      isConfirming: true,
    });
  };

  handleConfirm = () => {
    this.setState({
      isConfirming: false,
      isTransactionQueueStarted: true,
    });
  };

  handleCancel = () => {
    this.setState({
      isConfirming: false,
    });
  };

  handleContinue = () => {
    this.setState({
      isTransactionQueueStarted: false,
    });
  };

  render() {
    const { transactionQueue } = this.state;

    return (
      <Fragment>
        <Button onClick={this.handleStart}>Start transaction</Button>

        <ModalConfirmTransactionQueue
          isOpen={this.state.isConfirming}
          onSubmit={this.handleConfirm}
          onClose={this.handleCancel}
        >
          <ModalConfirmTransactionQueue.Header>
            Proceed with Your Dividend Configuration
          </ModalConfirmTransactionQueue.Header>
          <Paragraph fontSize={2}>Description</Paragraph>
          <div>
            {transactionQueue.transactions.map(transaction => (
              <TransactionItem
                key={transaction.id}
                Asset={SvgErc20}
                title="The transaction will be used to ...."
                description="2000000 TOKEN"
              />
            ))}
          </div>
        </ModalConfirmTransactionQueue>

        <ModalTransactionQueue
          isOpen={this.state.isTransactionQueueStarted}
          transactionQueue={transactionQueue}
          withEmail
          onContinue={this.handleContinue}
        />
      </Fragment>
    );
  }
}

{
  /* <TransactionQueue.Container>
  {transactionQueue => (
    <Fragment>
      <Button {...transactionQueue}>Start transaction</Button>
      <TransactionQueue.ModalConfirm {...transactionQueue} />
      <TransactionQueue
        transactionQueue={transactionQueue}
        withEmail
        onContinue={this.handleContinue}
        {...transactionQueue}
      />
    </Fragment>
  )}
</TransactionQueue.Container>; */
}
