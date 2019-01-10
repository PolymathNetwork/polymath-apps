import React, { Fragment } from 'react';
import { types } from '@polymathnetwork/new-shared';

import { ModalSequence } from './ModalSequence';

const sequence = {
  uid: '111',
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
  sequence: types.HigherLevelTransaction;
}

export class ModalDemo extends React.Component<{}, DemoState> {
  public state = {
    isModalOpen: false,
    sequence,
  };

  public componentDidUpdate(_prevProps: any, prevState: DemoState) {
    if (!prevState.isModalOpen && this.state.isModalOpen) {
      // Reset Modal state
      this.setState({
        sequence,
      });

      setTimeout(() => {
        this.setState({
          sequence: {
            ...this.state.sequence,
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
          sequence: {
            ...this.state.sequence,
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
          sequence: {
            ...this.state.sequence,
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
          sequence: {
            ...this.state.sequence,
            status: types.SequenceStatus.Succeeded,
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
        <ModalSequence
          isOpen={this.state.isModalOpen}
          sequence={this.state.sequence}
          withEmail
          onContinue={this.handleContinue}
        />
      </Fragment>
    );
  }
}
