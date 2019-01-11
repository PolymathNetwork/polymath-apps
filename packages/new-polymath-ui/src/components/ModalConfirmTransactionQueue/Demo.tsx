import React, { Fragment } from 'react';

import { Button } from '~/components/Button';
import { ModalConfirmTransactionQueue } from './ModalConfirmTransactionQueue';

export class ModalDemo extends React.Component {
  state = {
    isModalOpen: false,
  };

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

  render() {
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
