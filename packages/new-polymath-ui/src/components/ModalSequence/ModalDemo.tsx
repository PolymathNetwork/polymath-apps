import React, { Fragment } from 'react';
import { types } from '@polymathnetwork/new-shared';

import { ModalSequence } from './ModalSequence';

const sequence = {
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

export class ModalDemo extends React.Component {
  state = {
    isModalOpen: false,
    sequence,
  };

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isModalOpen && this.state.isModalOpen) {
      // Reset Modal state
      this.setState({
        sequence,
      });

      setTimeout(() => {
        this.setState({
          sequence: {
            ...this.state.sequence,
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
          sequence: {
            ...this.state.sequence,
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
          sequence: {
            ...this.state.sequence,
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
          sequence: {
            ...this.state.sequence,
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

  handleClick = () => {
    this.setState({
      isModalOpen: true,
    });
  };

  handleModalClose = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  handleContinue = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  render() {
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
