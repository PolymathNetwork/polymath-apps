import React, { Fragment } from 'react';

import { Button } from '~/components/Button';
import { ModalConfirmTransactionQueue } from './ModalConfirmTransactionQueue';

export class ModalDemo extends React.Component {
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

  public render() {
    return (
      <Fragment>
        <Button onClick={this.handleClick}>Open modal</Button>
        <ModalConfirmTransactionQueue
          isOpen={this.state.isModalOpen}
          onClose={this.handleModalClose.bind(this)}
          {...this.props}
        >
          Some content
        </ModalConfirmTransactionQueue>
      </Fragment>
    );
  }
}
