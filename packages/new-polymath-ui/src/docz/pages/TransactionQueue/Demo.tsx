import React, { Fragment } from 'react';
import { types } from '@polymathnetwork/new-shared';

import { Button } from '~/components/Button';
import { ModalTransactionQueue } from '~/components/ModalTransactionQueue';
import { ModalConfirmTransactionQueue } from '~/components/ModalConfirmTransactionQueue';
import { mockTransactionQueue } from '~/components/ModalTransactionQueue/docs/Demo';

interface State {
  transactionQueue: types.TransactionQueuePojo | null;
  isConfirmed: boolean;
}

interface Props {
  status: 'success' | 'failed';
}

export class Demo extends React.Component<Props, State> {
  public state: State = {
    transactionQueue: null,
    isConfirmed: false,
  };

  public componentDidUpdate(_prevProps: any, prevState: State) {
    const { transactionQueue } = this.state;

    if (!prevState.isConfirmed && this.state.isConfirmed && transactionQueue) {
      setTimeout(() => {
        this.setState({
          transactionQueue: {
            ...transactionQueue,
            status: types.TransactionQueueStatus.Running,
            transactions: [
              {
                uid: '0',
                status: types.TransactionStatus.Running,
                transactionQueueUid: '111',
                tag: types.PolyTransactionTags.Any,
                args: [],
              },
              {
                uid: '1',
                status: types.TransactionStatus.Idle,
                transactionQueueUid: '111',
                tag: types.PolyTransactionTags.Any,
                args: [],
              },
            ],
          },
        });
      }, 1000);

      setTimeout(() => {
        this.setState({
          transactionQueue: {
            ...transactionQueue,
            transactions: [
              {
                uid: '0',
                status: types.TransactionStatus.Succeeded,
                txHash: '0xcEe94E5D4c424E229af969Aa1c1fD0e1a9DE9ADB',
                transactionQueueUid: '111',
                tag: types.PolyTransactionTags.Any,
                args: [],
              },
              {
                uid: '1',
                status: types.TransactionStatus.Unapproved,
                transactionQueueUid: '111',
                tag: types.PolyTransactionTags.Any,
                args: [],
              },
            ],
          },
        });
      }, 2000);

      setTimeout(() => {
        this.setState({
          transactionQueue: {
            ...transactionQueue,
            transactions: [
              {
                uid: '0',
                status: types.TransactionStatus.Succeeded,
                txHash: '0xcEe94E5D4c424E229af969Aa1c1fD0e1a9DE9ADB',
                transactionQueueUid: '111',
                tag: types.PolyTransactionTags.Any,
                args: [],
              },
              {
                uid: '1',
                status: types.TransactionStatus.Running,
                transactionQueueUid: '111',
                tag: types.PolyTransactionTags.Any,
                args: [],
              },
            ],
          },
        });
      }, 3000);

      setTimeout(() => {
        this.setState({
          transactionQueue: {
            ...transactionQueue,
            status:
              this.props.status === 'success'
                ? types.TransactionQueueStatus.Succeeded
                : types.TransactionQueueStatus.Failed,
            transactions: [
              {
                uid: '0',
                status: types.TransactionStatus.Succeeded,
                txHash: '0xcEe94E5D4c424E229af969Aa1c1fD0e1a9DE9ADB',
                transactionQueueUid: '111',
                tag: types.PolyTransactionTags.Any,
                args: [],
              },
              {
                uid: '1',
                status: types.TransactionStatus.Succeeded,
                txHash: '0xcEe94E5D4c424E229af969Aa1c1fD0e1a9DE9ADB',
                transactionQueueUid: '111',
                tag: types.PolyTransactionTags.Any,
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
      transactionQueue: mockTransactionQueue,
    });
  };

  public handleConfirm = () => {
    this.setState({
      isConfirmed: true,
    });
  };

  public handleCancel = () => {
    this.setState({
      isConfirmed: false,
    });
  };

  public handleContinue = () => {
    this.setState({
      transactionQueue: null,
      isConfirmed: false,
    });
  };

  public render() {
    const { transactionQueue, isConfirmed } = this.state;

    return (
      <Fragment>
        <Button onClick={this.handleStart}>Start transaction</Button>

        {transactionQueue && (
          <Fragment>
            <ModalConfirmTransactionQueue
              transactionQueue={transactionQueue}
              isOpen={!!transactionQueue && !isConfirmed}
              onSubmit={this.handleConfirm}
              onClose={this.handleCancel}
            />
            <ModalTransactionQueue
              transactionQueue={transactionQueue}
              isOpen={!!transactionQueue && isConfirmed}
              withEmail
              onContinue={this.handleContinue}
            />
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export const DemoModal = () => null;
