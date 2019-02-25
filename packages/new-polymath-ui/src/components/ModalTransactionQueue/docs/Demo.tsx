import React, { Fragment } from 'react';
import { types } from '@polymathnetwork/new-shared';
import { ModalTransactionQueue } from '../ModalTransactionQueue';

export const mockTransactionQueue = {
  uid: '111',
  name: 'Dividend Configuration',
  status: types.TransactionQueueStatus.Idle,
  procedureType: types.ProcedureTypes.UnnamedProcedure,
  transactions: [
    {
      uid: '0',
      status: types.TransactionStatus.Unapproved,
      transactionQueueUid: '111',
      tag: types.PolyTransactionTags.Any,
      args: {},
    },
    {
      uid: '1',
      status: types.TransactionStatus.Idle,
      transactionQueueUid: '111',
      tag: types.PolyTransactionTags.Any,
      args: {},
    },
  ],
  args: {},
};

interface DemoState {
  isModalOpen: boolean;
  transactionQueue: types.TransactionQueuePojo | null;
}

export class Demo extends React.Component<{}, DemoState> {
  public state = {
    isModalOpen: false,
    transactionQueue: mockTransactionQueue,
  };

  public componentDidUpdate(_prevProps: any, prevState: DemoState) {
    if (!prevState.isModalOpen && this.state.isModalOpen) {
      // Reset Modal state
      this.setState({
        transactionQueue: mockTransactionQueue,
      });

      const { uid: transactionQueueUid } = mockTransactionQueue;

      setTimeout(() => {
        this.setState({
          transactionQueue: {
            ...this.state.transactionQueue,
            status: types.TransactionQueueStatus.Running,
            transactions: [
              {
                uid: '0',
                tag: types.PolyTransactionTags.Any,
                status: types.TransactionStatus.Running,
                transactionQueueUid,
                args: {},
              },
              {
                uid: '1',
                tag: types.PolyTransactionTags.Any,
                status: types.TransactionStatus.Idle,
                transactionQueueUid,
                args: {},
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
                tag: types.PolyTransactionTags.Any,
                status: types.TransactionStatus.Succeeded,
                txHash: '0xcEe94E5D4c424E229af969Aa1c1fD0e1a9DE9ADB',
                transactionQueueUid,
                args: {},
              },
              {
                uid: '1',
                tag: types.PolyTransactionTags.Any,
                status: types.TransactionStatus.Unapproved,
                transactionQueueUid,
                args: {},
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
                tag: types.PolyTransactionTags.Any,
                status: types.TransactionStatus.Succeeded,
                txHash: '0xcEe94E5D4c424E229af969Aa1c1fD0e1a9DE9ADB',
                transactionQueueUid,
                args: {},
              },
              {
                uid: '1',
                tag: types.PolyTransactionTags.Any,
                status: types.TransactionStatus.Running,
                transactionQueueUid,
                args: {},
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
                tag: types.PolyTransactionTags.Any,
                status: types.TransactionStatus.Succeeded,
                txHash: '0xcEe94E5D4c424E229af969Aa1c1fD0e1a9DE9ADB',
                transactionQueueUid,
                args: {},
              },
              {
                uid: '1',
                tag: types.PolyTransactionTags.Any,
                status: types.TransactionStatus.Succeeded,
                txHash: '0xcEe94E5D4c424E229af969Aa1c1fD0e1a9DE9ADB',
                transactionQueueUid,
                args: {},
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
