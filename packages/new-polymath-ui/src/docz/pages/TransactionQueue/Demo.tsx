import React, { Fragment } from 'react';
import { types } from '@polymathnetwork/new-shared';

import { Button } from '~/components/Button';
import { Paragraph } from '~/components/Paragraph';
import { TransactionItem } from '~/components/TransactionItem';
import { ModalTransactionQueue } from '~/components/ModalTransactionQueue';
import { ModalConfirmTransactionQueue } from '~/components/ModalConfirmTransactionQueue';
import { mockTransactionQueue } from '~/components/ModalTransactionQueue/docs/Demo';

import { SvgErc20 } from '~/images/icons/Erc20';

interface State {
  isTransactionQueueStarted: boolean;
  isConfirming: boolean;
}

export class Demo extends React.Component<State> {
  state = {
    isTransactionQueueStarted: false,
    isConfirming: false,
    transactionQueue: mockTransactionQueue,
  };

  componentDidUpdate(prevProps: any, prevState: State) {
    if (
      !prevState.isTransactionQueueStarted &&
      this.state.isTransactionQueueStarted
    ) {
      // Reset Modal state
      this.setState({
        transactionQueue: mockTransactionQueue,
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
                transactionQueueUid: '111',
                tag: types.PolyTransactionTags.Any,
                description: 'desc',
                args: [],
              },
              {
                uid: '1',
                type: 'Second transaction',
                status: types.TransactionStatus.Idle,
                transactionQueueUid: '111',
                tag: types.PolyTransactionTags.Any,
                description: 'desc',
                args: [],
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
                transactionQueueUid: '111',
                tag: types.PolyTransactionTags.Any,
                description: 'desc',
                args: [],
              },
              {
                uid: '1',
                type: 'Second transaction',
                status: types.TransactionStatus.Unapproved,
                transactionQueueUid: '111',
                tag: types.PolyTransactionTags.Any,
                description: 'desc',
                args: [],
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
                transactionQueueUid: '111',
                tag: types.PolyTransactionTags.Any,
                description: 'desc',
                args: [],
              },
              {
                uid: '1',
                type: 'Second transaction',
                status: types.TransactionStatus.Running,
                transactionQueueUid: '111',
                tag: types.PolyTransactionTags.Any,
                description: 'desc',
                args: [],
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
                transactionQueueUid: '111',
                tag: types.PolyTransactionTags.Any,
                description: 'desc',
                args: [],
              },
              {
                uid: '1',
                type: 'Second transaction',
                status: types.TransactionStatus.Succeeded,
                hash: '0xcEe94E5D4c424E229af969Aa1c1fD0e1a9DE9ADB',
                transactionQueueUid: '111',
                tag: types.PolyTransactionTags.Any,
                description: 'desc',
                args: [],
              },
            ],
          },
        });
      }, 4000);
    }
  }

  public handleStart = () => {
    this.setState({
      isConfirming: true,
    });
  };

  public handleConfirm = () => {
    this.setState({
      isConfirming: false,
      isTransactionQueueStarted: true,
    });
    transactionQueue = { transactionQueue };
  };

  public handleCancel = () => {
    this.setState({
      isConfirming: false,
    });
  };

  public handleContinue = () => {
    this.setState({
      isTransactionQueueStarted: false,
    });
  };

  public render() {
    const { transactionQueue } = this.state;

    return (
      <Fragment>
        <Button onClick={this.handleStart}>Start transaction</Button>

        <ModalConfirmTransactionQueue
          transactionQueue={transactionQueue}
          isOpen={this.state.isConfirming}
          onSubmit={this.handleConfirm}
          onClose={this.handleCancel}
        />
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

export const DemoModal = () => null;
