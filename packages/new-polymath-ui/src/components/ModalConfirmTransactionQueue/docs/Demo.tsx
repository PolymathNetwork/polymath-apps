import React, { Fragment } from 'react';
import { Button } from '~/components/Button';
import { GridRow } from '~/components/GridRow';
import { mockTransactionQueue } from '~/components/ModalTransactionQueue/docs/Demo';
import { ModalConfirmTransactionQueue } from '../ModalConfirmTransactionQueue';

export class Demo extends React.Component {
  public state = {
    isModalOpen: false,
  };

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

  public handleSubmit = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  public render() {
    return (
      <Fragment>
        <Button onClick={this.handleClick}>Open modal</Button>
        <ModalConfirmTransactionQueue
          isOpen={this.state.isModalOpen}
          onClose={this.handleModalClose}
          onSubmit={this.handleSubmit}
          transactionQueue={mockTransactionQueue}
        >
          Some content
        </ModalConfirmTransactionQueue>
      </Fragment>
    );
  }
}
