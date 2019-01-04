import React, { Fragment } from 'react';

import { ModalTx } from './';

export class ModalDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      transactions: [
        { id: 0, type: 'First transaction', status: 'UNAPPROVED' },
        { id: 1, type: 'Second transaction', status: 'IDLE' },
      ],
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isModalOpen && this.state.isModalOpen) {
      setTimeout(() => {
        this.setState({
          transactions: [
            { id: 0, type: 'First transaction', status: 'APPROVED' },
            { id: 1, type: 'Second transaction', status: 'IDLE' },
          ],
        });
      }, 2000);

      setTimeout(() => {
        this.setState({
          transactions: [
            { id: 0, type: 'First transaction', status: 'SUCCEEDED' },
            { id: 1, type: 'Second transaction', status: 'UNAPPROVED' },
          ],
        });
      }, 4000);

      setTimeout(() => {
        this.setState({
          transactions: [
            { id: 0, type: 'First transaction', status: 'SUCCEEDED' },
            { id: 1, type: 'Second transaction', status: 'APPROVED' },
          ],
        });
      }, 6000);
    }
  }

  handleClick() {
    this.setState({
      isModalOpen: true,
    });
  }

  handleModalClose() {
    this.setState({
      isModalOpen: false,
    });
  }

  render() {
    return (
      <Fragment>
        <button className="btn" onClick={this.handleClick}>
          Start transaction
        </button>
        <ModalTx
          isOpen={this.state.isModalOpen}
          status={0}
          transactions={this.state.transactions}
          withEmail
        />
      </Fragment>
    );
  }
}
